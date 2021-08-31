/* eslint-disable mocha/no-exports */

import path from 'path';
import assert from 'assert';
import { lint } from 'stylelint';

export const runCodeTest = (options = {}) => {
	const { ruleName, config, accept, reject } = options;

	accept.forEach(({ code, syntax = 'css' }) => {
		it(`should pass for: \`${code}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				code,
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
			assert.equal(
				parseErrors.length,
				0,
				`Accept case contains parse errors, expected 0, got ${parseErrors.length}`
			);
		});
	});

	reject.forEach(({ code, syntax = 'css', result }) => {
		it(`should reject for: \`${code}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				code,
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			const [{ rule, severity, ...warning }] = warnings;
			assert.deepEqual(warning, result, 'Expected different warning');
		});
	});
};

export const runFileTest = (options = {}) => {
	const { ruleName, config, accept, reject } = options;

	accept.forEach(({ files, syntax = 'css' }) => {
		it(`should pass for: \`${files}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				files: path.resolve(__dirname, '../', files),
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
			assert.equal(
				parseErrors.length,
				0,
				`Accept case contains parse errors, expected 0, got ${parseErrors.length}`
			);
		});
	});

	reject.forEach(({ files, syntax = 'css', results }) => {
		it(`should reject for: \`${files}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				files: path.resolve(__dirname, '../', files),
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(
				warnings.length,
				results.length,
				`Not all warnings have been covered for reject case`
			);
			assert.equal(
				parseErrors.length,
				0,
				`Reject case contains parse errors, expected 0, got ${parseErrors.length}`
			);
			warnings.forEach(({ rule, severity, ...warning }, index) => {
				assert.deepEqual(
					warning,
					results[index],
					`Warning is not covered: "${warning.text}"`
				);
			});
		});
	});
};
