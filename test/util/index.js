/* eslint-disable mocha/no-exports */

import { fileURLToPath } from 'node:url';
import assert from 'node:assert';
import stylelint from 'stylelint';
import plugin from '../../index.js';

/**
 * @typedef {import('stylelint').CustomSyntax} CustomSyntax
 */

/**
 * @typedef {object} Test
 * @property {string}       input
 * @property {CustomSyntax} [customSyntax]
 * @property {object[]}     result
 */

/**
 * @typedef {object} TestOptions
 * @property {string}         ruleName
 * @property {object|boolean} config
 * @property {Test[]}         accept
 * @property {Test[]}         reject
 * @property {CustomSyntax}   [customSyntax]
 */

/**
 * @param {TestOptions} options
 */
export const runCodeTest = (options) => {
	const { ruleName, config, customSyntax, accept, reject } = options ?? {};

	accept.forEach(({ input, customSyntax: syntax }) => {
		it(`should pass for: \`${input}\``, async function () {
			const { results } = await stylelint.lint({
				code: input,
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			const warnings = results[0]?.warnings ?? [];
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
		});
	});

	reject.forEach(({ input, customSyntax: syntax, result }) => {
		it(`should reject for: \`${input}\``, async function () {
			const { results } = await stylelint.lint({
				code: input,
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			const warnings = results[0]?.warnings ?? [];
			assert.equal(
				warnings.length,
				result.length,
				`Not all warnings have been covered for reject case`
			);
			warnings.forEach(({ rule, severity, url, ...warning }, index) => {
				assert.deepEqual(
					warning,
					result[index],
					`Warning is not covered: "${warning.text}"`
				);
			});
		});
	});
};

/**
 * @param {TestOptions} options
 */
export const runFileTest = (options) => {
	const { ruleName, config, customSyntax, accept, reject } = options ?? {};

	accept.forEach(({ input, customSyntax: syntax }) => {
		it(`should pass for: \`${input}\``, async function () {
			const { results } = await stylelint.lint({
				files: fileURLToPath(new URL(`../${input}`, import.meta.url)),
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			const warnings = results[0]?.warnings ?? [];
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
		});
	});

	reject.forEach(({ input, customSyntax: syntax, result }) => {
		it(`should reject for: \`${input}\``, async function () {
			const { results } = await stylelint.lint({
				files: fileURLToPath(new URL(`../${input}`, import.meta.url)),
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			const warnings = results[0]?.warnings ?? [];
			assert.equal(
				warnings.length,
				result.length,
				`Not all warnings have been covered for reject case`
			);
			warnings.forEach(({ rule, severity, url, ...warning }, index) => {
				assert.deepEqual(
					warning,
					result[index],
					`Warning is not covered: "${warning.text}"`
				);
			});
		});
	});
};
