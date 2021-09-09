/* eslint-disable import/dynamic-import-chunkname */

/**
 * @typedef {import('postcss').Root} Root
 * @typedef {import('postcss').ChildNode} ChildNode
 * @typedef {import('sass-render-errors/esm/types').Options} SassOptions
 * @typedef {import('sass-render-errors/esm/types').SassRenderError} SassRenderError
 */

/**
 * @typedef {object} PluginConfig
 * @property {boolean}            sync
 * @property {string|SassOptions} sassOptions
 * @property {boolean}            checkUndefinedFunctions
 */

import path from 'path';
import Ajv from 'ajv';
import stylelint from 'stylelint';
import renderErrorsFactory, {
	undefinedFunctions as undefinedFunctionsFactory
} from 'sass-render-errors';
// @ts-ignore
import sass from 'sass';
import pkgUp from 'pkg-up';
import resolveFrom from 'resolve-from';
import pMemoize from 'p-memoize';

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

const renderErrorsRenderer = renderErrorsFactory(sass);
const undefinedFunctionRenderer = undefinedFunctionsFactory(sass);

const importConfig = pMemoize(async (/** @type {string} */ configLocation) => {
	let config;
	const { default: importedConfig } = await import(configLocation);
	if (typeof importedConfig === 'function') {
		config = await importedConfig();
	} else {
		config = importedConfig;
	}
	return config;
});

const getConfigLocation = pMemoize(
	async (/** @type {string} */ cwd, /** @type {string} */ configValue) => {
		const packagePath = await pkgUp({ cwd });
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
 * @param   {{ file: string, css: string }} input
 * @param   {PluginConfig["sassOptions"]}   configValue
 *
 * @returns {Promise<SassOptions>}
 */
async function getSassOptions(input, configValue) {
	const { file, css } = input;
	/** @type {SassOptions} */
	let config;

	if (typeof configValue === 'string') {
		const configLocation = await getConfigLocation(
			process.cwd(),
			configValue
		);
		const importedConfig = await importConfig(configLocation);
		config = importedConfig;
	} else {
		config = configValue;
	}

	const options = {
		...config,
		quietDeps: true
	};
	if (file !== 'stdin') {
		options.file = file;
	}
	if (!isValidStyleFile(file)) {
		options.data = css;
	}
	return options;
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

	const closestNode = { diff: Infinity, index: -1 };

	nodes.forEach((node, index) => {
		const diff = Math.abs((node?.source?.start?.column ?? 0) - column);
		if (diff < closestNode.diff) {
			closestNode.diff = diff;
			closestNode.index = index;
		}
	});
	return nodes[closestNode.index] ?? cssRoot;
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

const plugin = stylelint.createPlugin(
	ruleName,
	(/** @type {PluginConfig} */ resolveRules) => async (cssRoot, result) => {
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
			checkUndefinedFunctions = false
		} = resolveRules;

		/** @type {SassOptions} */
		let sassOptions;
		const file = cssRoot.source?.input.file ?? 'stdin';
		/*
		 * PostCSS types don’t have "css" property even though it’s documented
		 */
		// @ts-ignore
		const css = cssRoot.source?.input.css ?? '';

		try {
			sassOptions = await getSassOptions(
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

		const renderers = [renderErrorsRenderer];
		if (checkUndefinedFunctions) {
			renderers.push(undefinedFunctionRenderer);
		}

		const results = await Promise.all(
			renderers.map((renderer) => {
				if (sync) {
					return renderer.renderSync(sassOptions);
				}
				return renderer.render(sassOptions);
			})
		);

		/** @type {SassRenderError[]} */
		let errors = [];
		errors = errors.concat(...results);

		const shouldApplyOffset = !isValidStyleFile(file);

		unique(errors)
			.filter((error) => error.file === file)
			.forEach((error) => {
				let offset = 0;
				if (shouldApplyOffset) {
					offset = cssRoot?.first?.source?.start?.line ?? 0;
				}

				const closestNode = getClosestNode(
					cssRoot,
					offset + error.source.start.line,
					error.source.start.column
				);
				const closestLine =
					closestNode?.source?.start?.line ?? error.source.start.line;

				stylelint.utils.report({
					ruleName: ruleName,
					result: result,
					node: closestNode,
					word: error.source.pattern,
					line: closestLine,
					message: messages.report(error.message)
				});
			});
	}
);
plugin.messages = messages;

export default plugin;
