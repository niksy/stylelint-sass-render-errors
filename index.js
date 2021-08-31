/* eslint-disable import/dynamic-import-chunkname */

import path from 'path';
import Ajv from 'ajv';
import stylelint from 'stylelint';
import createRenderer from 'sass-render-errors';
import sass from 'sass';
import pkgUp from 'pkg-up';
import resolveFrom from 'resolve-from';

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

async function getSassOptions(input, configValue) {
	const file = input.file;
	const source = input.css;
	let config;

	if (typeof configValue === 'string') {
		const packagePath = await pkgUp();
		const startingLocation = path.dirname(packagePath);
		const configLocation = resolveFrom(startingLocation, configValue);
		const { default: importedConfig } = await import(configLocation);
		if (typeof importedConfig === 'function') {
			config = await importedConfig();
		} else {
			config = importedConfig;
		}
	} else {
		config = configValue;
	}

	if (typeof file !== 'undefined') {
		return {
			...config,
			file: file,
			quietDeps: true
		};
	}
	return {
		...config,
		data: source,
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
				cssRoot.source.input,
				initialSassOptions
			);
		} catch (error) {
			stylelint.utils.report({
				ruleName: ruleName,
				result: result,
				node: cssRoot,
				line: 1,
				column: 1,
				message: messages.report(error.message)
			});
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
				column: error.source.start.column,
				message: messages.report(error.message)
			});
		});
	}
);
plugin.messages = messages;

export default plugin;
