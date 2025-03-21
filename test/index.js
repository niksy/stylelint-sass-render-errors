import { ruleName, messages } from '../index.js';
import { runCodeTest, runFileTest } from './util/index.js';

describe('Config as object', function () {
	[{ sync: false }, { sync: true }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 5,
							column: 9,
							endLine: 5,
							endColumn: 24,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
							endLine: 9,
							endColumn: 32,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				}
			]
		});

		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {
					loadPaths: ['test/fixtures/loki']
				}
			},
			accept: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: '@use "sass:math";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 36,
							endLine: 1,
							endColumn: 51,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {
					loadPaths: ['test/fixtures/loki']
				}
			},
			accept: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});
	});
});

describe('Config as file returning (async) function', function () {
	[{ sync: false }, { sync: true }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.function.cjs'
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 4,
							column: 1,
							endLine: 4,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 5,
							column: 9,
							endLine: 5,
							endColumn: 24,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
							endLine: 9,
							endColumn: 32,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 8,
							column: 9,
							endLine: 8,
							endColumn: 24,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 12,
							column: 25,
							endLine: 12,
							endColumn: 32,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				}
			]
		});

		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.function.options.cjs'
			},
			accept: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.function.cjs'
			},
			accept: [
				{
					input: '@use "sass:math";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 36,
							endLine: 1,
							endColumn: 51,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.function.options.cjs'
			},
			accept: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});
	});
});

describe('Config as file returning object', function () {
	[{ sync: false }, { sync: true }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.object.cjs'
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 4,
							column: 1,
							endLine: 4,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 5,
							column: 9,
							endLine: 5,
							endColumn: 24,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
							endLine: 9,
							endColumn: 32,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 8,
							column: 9,
							endLine: 8,
							endColumn: 24,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 12,
							column: 25,
							endLine: 12,
							endColumn: 32,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				}
			]
		});

		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.object.options.cjs'
			},
			accept: [
				{
					input: './fixtures/reject.errors.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.object.cjs'
			},
			accept: [
				{
					input: '@use "sass:math";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 1,
							endLine: 1,
							endColumn: 12,
							text: messages.report("Can't find stylesheet to import.")
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 36,
							endLine: 1,
							endColumn: 51,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.object.options.cjs'
			},
			accept: [
				{
					input: '@use "loki";',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: []
		});
	});
});

describe('Check undefined functions', function () {
	[
		{ sync: false, checkUndefinedFunctions: true },
		{ sync: true, checkUndefinedFunctions: true }
	].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.undefined-functions.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 5,
							column: 9,
							endLine: 5,
							endColumn: 14,
							text: messages.report('Undefined function.')
						}
					]
				},
				{
					input: './fixtures/reject.undefined-functions.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 8,
							column: 9,
							endLine: 8,
							endColumn: 14,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: 'body { width: calc(100px + 1px); }',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: 'body { width: becky(#f00); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 15,
							endLine: 1,
							endColumn: 20,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});
	});
});

describe('Check undefined functions, disallowed known and additional unknown CSS functions', function () {
	[
		{
			sync: false,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rotate']
		},
		{
			sync: true,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rotate']
		}
	].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.undefined-functions.disallowed-functions.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 2,
							column: 13,
							endLine: 2,
							endColumn: 19,
							text: messages.report('Undefined function.')
						},
						{
							line: 3,
							column: 10,
							endLine: 3,
							endColumn: 16,
							text: messages.report('Undefined function.')
						}
					]
				},
				{
					input: './fixtures/reject.undefined-functions.disallowed-functions.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 5,
							column: 13,
							endLine: 5,
							endColumn: 19,
							text: messages.report('Undefined function.')
						},
						{
							line: 6,
							column: 10,
							endLine: 6,
							endColumn: 16,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: 'body { width: calc(100px + 1px); }',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: 'body { transform: rotate(180deg); height: v-bind(height); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 19,
							endLine: 1,
							endColumn: 25,
							text: messages.report('Undefined function.')
						},
						{
							line: 1,
							column: 43,
							endLine: 1,
							endColumn: 49,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});
	});
});

describe('Check undefined functions, disallowed known and allowed additional known CSS functions', function () {
	[
		{
			sync: false,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rotate'],
			additionalKnownCssFunctions: ['v-bind']
		},
		{
			sync: true,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rotate'],
			additionalKnownCssFunctions: ['v-bind']
		}
	].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: './fixtures/accept.scss',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.undefined-functions.disallowed-functions.scss',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 2,
							column: 13,
							endLine: 2,
							endColumn: 19,
							text: messages.report('Undefined function.')
						}
					]
				},
				{
					input: './fixtures/reject.undefined-functions.disallowed-functions.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 5,
							column: 13,
							endLine: 5,
							endColumn: 19,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});

		runCodeTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					input: 'body { width: calc(100px + 1px); }',
					customSyntax: 'postcss-scss',
					result: []
				}
			],
			reject: [
				{
					input: 'body { transform: rotate(180deg); height: v-bind(height); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 19,
							endLine: 1,
							endColumn: 25,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});
	});
});
