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
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					result: [
						{
							line: 1,
							column: 9,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					result: [
						{
							line: 5,
							column: 9,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
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
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					result: [
						{
							line: 1,
							column: 1,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: [
						{
							line: 1,
							column: 36,
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
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					result: [
						{
							line: 1,
							column: 9,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					result: [
						{
							line: 4,
							column: 9,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					result: [
						{
							line: 5,
							column: 9,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.vue',
					result: [
						{
							line: 8,
							column: 9,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 12,
							column: 25,
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
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					result: [
						{
							line: 1,
							column: 1,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: [
						{
							line: 1,
							column: 36,
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
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.errors.scss',
					result: [
						{
							line: 1,
							column: 9,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.errors.vue',
					result: [
						{
							line: 4,
							column: 9,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.scss',
					result: [
						{
							line: 5,
							column: 9,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 9,
							column: 25,
							text: messages.report(
								'Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div.'
							)
						}
					]
				},
				{
					input: './fixtures/reject.deprecations.vue',
					result: [
						{
							line: 8,
							column: 9,
							text: messages.report(
								'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
							)
						},
						{
							line: 12,
							column: 25,
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
					result: []
				}
			],
			reject: [
				{
					input: '@use "loki";',
					result: [
						{
							line: 1,
							column: 1,
							text: messages.report(
								"Can't find stylesheet to import."
							)
						}
					]
				},
				{
					input: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: [
						{
							line: 1,
							column: 36,
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
					result: []
				}
			],
			reject: [
				{
					input: './fixtures/reject.undefined-functions.scss',
					result: [
						{
							line: 3,
							column: 9,
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
					result: []
				}
			],
			reject: [
				{
					input: 'body { width: becky(#f00); }',
					result: [
						{
							line: 1,
							column: 15,
							text: messages.report('Undefined function.')
						}
					]
				}
			]
		});
	});
});
