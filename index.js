/* eslint-disable import/dynamic-import-chunkname */

/**
 * @typedef {import('postcss').Root} Root
 * @typedef {import('postcss').ChildNode} ChildNode
 * @typedef {import('sass-render-errors/types/render-errors').SassRenderError} SassRenderError
 * @typedef {import('sass-render-errors/types/undefined-functions').Options} Options
 * @typedef {import('sass').Options<"sync">|import('sass').Options<"async">|import('sass').StringOptions<"sync">|import('sass').StringOptions<"async">} SassOptions
 */

/**
 * @typedef {object} PluginConfig
 * @property {boolean} sync
 * @property {string|SassOptions} sassOptions
 * @property {boolean} checkUndefinedFunctions
 * @property {Options["disallowedKnownCssFunctions"]} disallowedKnownCssFunctions
 * @property {Options["additionalKnownCssFunctions"]} additionalKnownCssFunctions
 */

import path from 'node:path';
import AjvModule from 'ajv';
import stylelint from 'stylelint';
import renderErrorsFactory, {
	undefinedFunctions as undefinedFunctionsFactory
} from 'sass-render-errors';
import sass from 'sass';
import { packageUp } from 'package-up';
import resolveFrom from 'resolve-from';
import pMemoize from 'p-memoize';
import memoize from 'memoize';
import ManyKeysMap from 'many-keys-map';

const Ajv = AjvModule.default;

const ruleName = 'plugin/sass-render-errors';

const validStyleFileExtensions = ['.scss', '.sass', '.css'];

const ajv = new Ajv();
const validateOptions = ajv.compile({
	oneOf: [
		{ type: 'boolean' },
		{
			type: 'object',
			additionalProperties: false,
			properties: {
				checkUndefinedFunctions: {
					type: 'boolean'
				},
				disallowedKnownCssFunctions: {
					type: 'array'
				},
				additionalKnownCssFunctions: {
					type: 'array'
				},
				sync: {
					type: 'boolean'
				},
				sassOptions: {
					oneOf: [{ type: 'string' }, { type: 'object' }]
				}
			}
		}
	]
});

const messages = stylelint.utils.ruleMessages(ruleName, {
	report: (/** @type {string} */ value) => value
});

const renderErrorsRenderer = memoize(renderErrorsFactory);
const undefinedFunctionRenderer = memoize(undefinedFunctionsFactory, {
	cacheKey: ([sassInstance, ...arguments_]) => [sassInstance, JSON.stringify(arguments_)],
	cache: new ManyKeysMap()
});

const importConfig = pMemoize(async (/** @type {string} */ configLocation) => {
	let config;
	const { default: importedConfig } = await import(configLocation);
	if (typeof importedConfig === 'function') {
		config = await importedConfig();
	} else {
		config = importedConfig;
	}
	return /** @type {SassOptions} */ (config);
});

const getConfigLocation = pMemoize(
	async (/** @type {string} */ cwd, /** @type {string} */ configValue) => {
		const packagePath = await packageUp({ cwd });
		const startingLocation = path.dirname(packagePath ?? cwd);
		const configLocation = resolveFrom(startingLocation, configValue);
		return configLocation;
	},
	{ cacheKey: JSON.stringify }
);

/**
 * @param {string} file
 */
function isValidStyleFile(file) {
	const extension = path.extname(file);
	return file !== 'stdin' && validStyleFileExtensions.includes(extension);
}

/**
 * @param {{ file: string, css: string }} input
 * @param {PluginConfig["sassOptions"]} configValue
 */
async function getCompilerOptions(input, configValue) {
	const { file, css } = input;
	let config;

	if (typeof configValue === 'string') {
		const configLocation = await getConfigLocation(process.cwd(), configValue);
		const importedConfig = await importConfig(configLocation);
		config = importedConfig;
	} else {
		config = configValue;
	}

	const options = {
		...config,
		quietDeps: true
	};

	let type;
	let value = file ?? css ?? '';

	/** @type {{file: ?string}}*/
	const meta = { file: null };

	if (file !== 'stdin') {
		meta.file = file;
		type = 'file';
		value = file;
	}
	if (!isValidStyleFile(file)) {
		type = 'code';
		value = css;
	}
	return {
		type: type,
		value: value,
		meta: meta,
		options: options
	};
}

/**
 * @param {Root}   cssRoot
 * @param {number} line
 * @param {number} column
 */
function getClosestNode(cssRoot, line, column) {
	/** @type {ChildNode[]} */
	const nodes = [];

	cssRoot.walk((node) => {
		if (node?.source?.start?.line === line) {
			nodes.push(node);
		}
	});

	let closestIndex = 0;
	let closestDistance = Number.MAX_VALUE;

	nodes.forEach((node, index) => {
		const start = node?.source?.start;
		const end = node?.source?.end;
		const startDistance = Math.sqrt(
			Math.pow((start?.line ?? 1) - line, 2) + Math.pow((start?.column ?? 0) - column, 2)
		);
		const endDistance = Math.sqrt(
			Math.pow((end?.line ?? 1) - line, 2) + Math.pow((end?.column ?? 0) - column, 2)
		);
		const minDistance = Math.min(startDistance, endDistance);

		if (minDistance < closestDistance) {
			closestDistance = minDistance;
			closestIndex = index;
		}
	});

	return nodes[closestIndex] ?? cssRoot;
}

/**
 * @param {SassRenderError[]} errors
 */
function unique(errors) {
	/* eslint-disable unicorn/prefer-spread */
	/** @type {[string, SassRenderError][]} */
	const collection = errors.map((entry) => {
		const { stack, ...key } = entry;
		return [JSON.stringify(key), entry];
	});
	const map = new Map(collection);
	return Array.from(map.values());
}

/**
 * @type  {stylelint.RuleBase}
 */
function ruleFunction(/** @type {PluginConfig}*/ resolveRules) {
	return async (cssRoot, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: resolveRules,
			possible: validateOptions
		});

		if (!validOptions) {
			return;
		}

		const {
			sync = false,
			sassOptions: initialSassOptions = {},
			checkUndefinedFunctions = false,
			disallowedKnownCssFunctions = [],
			additionalKnownCssFunctions = []
		} = resolveRules;

		let compilerOptions;
		const file = cssRoot.source?.input.file ?? 'stdin';
		const css = cssRoot.source?.input.css ?? '';

		try {
			compilerOptions = await getCompilerOptions(
				{
					file: file,
					css: css
				},
				initialSassOptions
			);
		} catch (/** @type {any} */ error_) {
			/** @type {Error} */
			const error = error_;
			stylelint.utils.report({
				ruleName: ruleName,
				result: result,
				node: cssRoot,
				line: 1,
				message: messages.report(error.message)
			});
			return;
		}

		const renderers = [renderErrorsRenderer(sass)];
		if (checkUndefinedFunctions) {
			renderers.push(
				undefinedFunctionRenderer(sass, {
					disallowedKnownCssFunctions,
					additionalKnownCssFunctions
				})
			);
		}

		const results = await Promise.all(
			renderers.map((renderer) => {
				if (sync && compilerOptions.type === 'file') {
					return renderer.compile(
						compilerOptions.value,
						/** @type {import('sass').Options<"sync">}*/ (compilerOptions.options)
					);
				}
				if (!sync && compilerOptions.type === 'file') {
					return renderer.compileAsync(
						compilerOptions.value,
						/** @type {import('sass').Options<"async">}*/ (compilerOptions.options)
					);
				}
				if (sync && compilerOptions.type === 'code') {
					return renderer.compileString(
						compilerOptions.value,
						/** @type {import('sass').StringOptions<"sync">}*/ (compilerOptions.options)
					);
				}
				if (!sync && compilerOptions.type === 'code') {
					// prettier-ignore
					return renderer.compileStringAsync(
						compilerOptions.value,
						/** @type {import('sass').StringOptions<"async">}*/ (compilerOptions.options)
					);
				}
				return [];
			})
		);
		const errors = results.flat();

		const shouldApplyOffset = !isValidStyleFile(file);

		unique(errors)
			.filter((error) => {
				const referenceFile =
					error.file === 'stdin' && typeof compilerOptions.meta.file === 'string'
						? compilerOptions.meta.file
						: error.file;
				return referenceFile === file;
			})
			.forEach((error) => {
				let offset = 0;
				if (shouldApplyOffset) {
					offset = Math.max((cssRoot?.first?.source?.start?.line ?? 0) - 1, 0);
				}

				const closestNode = getClosestNode(
					cssRoot,
					offset + error.source.start.line,
					error.source.start.column
				);
				const closestLine = closestNode?.source?.start?.line ?? error.source.start.line;

				stylelint.utils.report({
					ruleName: ruleName,
					result: result,
					node: closestNode,
					word: error.source.pattern,
					line: closestLine,
					message: messages.report(error.message)
				});
			});
	};
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export { ruleName, messages };

export default stylelint.createPlugin(ruleName, ruleFunction);
