/* eslint-disable import/dynamic-import-chunkname */

/**
 * @typedef {import('sass-render-errors').SassOptions} SassOptions
 */

import path from 'path';
import Ajv from 'ajv';
import stylelint from 'stylelint';
import createRenderer from 'sass-render-errors';
// @ts-ignore
import sass from 'sass';
import pkgUp from 'pkg-up';
import resolveFrom from 'resolve-from';
import pMemoize from 'p-memoize';

const ruleName = 'plugin/sass-render-errors';

const ajv = new Ajv();
const validateOptions = ajv.compile({
	oneOf: [
		{ type: 'boolean' },
		{
			type: 'object',
			additionalProperties: false,
			properties: {
				renderMode: {
					type: 'string',
					enum: ['async', 'sync']
				},
				sassOptions: {
					oneOf: [{ type: 'string' }, { type: 'object' }]
				}
			}
		}
	]
});

const messages = stylelint.utils.ruleMessages(ruleName, {
	report: (value) => value
});

const renderer = createRenderer(sass);

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
 * @param   {{ file: string, css: string }} input
 * @param   {string|object}                 configValue
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

	if (file !== '') {
		return {
			...config,
			file: file,
			quietDeps: true
		};
	}
	return {
		...config,
		data: css,
		quietDeps: true
	};
}

const plugin = stylelint.createPlugin(
	ruleName,
	(resolveRules) => async (cssRoot, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: resolveRules,
			possible: validateOptions
		});

		if (!validOptions) {
			return;
		}

		const { renderMode = 'async', sassOptions: initialSassOptions = {} } =
			resolveRules;

		let sassOptions;

		try {
			sassOptions = await getSassOptions(
				{
					file: cssRoot.source?.input.file ?? '',
					css: result.css ?? ''
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

		const resolvedRenderer =
			renderMode === 'async' ? renderer.render : renderer.renderSync;
		const renderResult = await resolvedRenderer(sassOptions);

		renderResult.forEach((error) => {
			stylelint.utils.report({
				ruleName: ruleName,
				result: result,
				node: cssRoot,
				word: error.source.pattern,
				line: error.source.start.line,
				message: messages.report(error.message)
			});
		});
	}
);
plugin.messages = messages;

export default plugin;
