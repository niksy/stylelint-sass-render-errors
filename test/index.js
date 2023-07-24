import function_ from '../index';
import { runCodeTest, runFileTest } from './util';

const { ruleName, messages } = function_;

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
							column: 9,
							endLine: 1,
							endColumn: 15,
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
					includePaths: ['test/fixtures/loki']
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
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
					includePaths: ['test/fixtures/loki']
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
				sassOptions: './test/fixtures/config.function'
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
							column: 9,
							endLine: 1,
							endColumn: 15,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 4,
							column: 9,
							endLine: 4,
							endColumn: 15,
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
				sassOptions: './test/fixtures/config.function.options'
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
				sassOptions: './test/fixtures/config.function'
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
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
				sassOptions: './test/fixtures/config.function.options'
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
				sassOptions: './test/fixtures/config.object'
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
							column: 9,
							endLine: 1,
							endColumn: 15,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					customSyntax: 'postcss-html',
					result: [
						{
							line: 4,
							column: 9,
							endLine: 4,
							endColumn: 15,
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
				sassOptions: './test/fixtures/config.object.options'
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
				sassOptions: './test/fixtures/config.object'
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
							text: messages.report(
								"Can't find stylesheet to import."
							)
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
				sassOptions: './test/fixtures/config.object.options'
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
							line: 3,
							column: 9,
							endLine: 3,
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
							line: 6,
							column: 9,
							endLine: 6,
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

describe('Check undefined functions, disallowed known CSS functions', function () {
	[
		{
			sync: false,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rem']
		},
		{
			sync: true,
			checkUndefinedFunctions: true,
			disallowedKnownCssFunctions: ['rem']
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
							column: 14,
							endLine: 2,
							endColumn: 17,
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
							column: 14,
							endLine: 5,
							endColumn: 17,
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
					input: 'body { min-height: rem(10); }',
					customSyntax: 'postcss-scss',
					result: [
						{
							line: 1,
							column: 20,
							endLine: 1,
							endColumn: 23,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});
	});
});
