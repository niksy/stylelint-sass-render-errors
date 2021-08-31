import path from 'path';
import function_ from '../index';
import { runCodeTest, runFileTest } from './util';

const { ruleName, messages } = function_;

describe('Config as object', function () {
	[{ renderMode: 'async' }, { renderMode: 'sync' }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: {}
			},
			accept: [
				{
					files: './fixtures/accept.scss'
				}
			],
			reject: [
				{
					files: './fixtures/reject.errors.scss',
					results: [
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
					files: './fixtures/reject.deprecations.scss',
					results: [
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
					files: './fixtures/reject.errors.scss'
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
					code: '@use "sass:math";'
				}
			],
			reject: [
				{
					code: '@use "loki";',
					result: {
						line: 1,
						column: 1,
						text: messages.report(
							"Can't find stylesheet to import."
						)
					}
				},
				{
					code: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: {
						line: 1,
						column: 36,
						text: messages.report(
							'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
						)
					}
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
					code: '@use "loki";'
				}
			],
			reject: []
		});
	});
});

describe('Config as file returning (async) function', function () {
	[{ renderMode: 'async' }, { renderMode: 'sync' }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.function'
			},
			accept: [
				{
					files: './fixtures/accept.scss'
				}
			],
			reject: [
				{
					files: './fixtures/reject.errors.scss',
					results: [
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
					files: './fixtures/reject.deprecations.scss',
					results: [
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
				sassOptions: './test/fixtures/config.function.options'
			},
			accept: [
				{
					files: './fixtures/reject.errors.scss'
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
					code: '@use "sass:math";'
				}
			],
			reject: [
				{
					code: '@use "loki";',
					result: {
						line: 1,
						column: 1,
						text: messages.report(
							"Can't find stylesheet to import."
						)
					}
				},
				{
					code: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: {
						line: 1,
						column: 36,
						text: messages.report(
							'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
						)
					}
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
					code: '@use "loki";'
				}
			],
			reject: []
		});
	});
});

describe('Config as file returning object', function () {
	[{ renderMode: 'async' }, { renderMode: 'sync' }].forEach((options) => {
		runFileTest({
			ruleName: ruleName,
			config: {
				...options,
				sassOptions: './test/fixtures/config.object'
			},
			accept: [
				{
					files: './fixtures/accept.scss'
				}
			],
			reject: [
				{
					files: './fixtures/reject.errors.scss',
					results: [
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
					files: './fixtures/reject.deprecations.scss',
					results: [
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
				sassOptions: './test/fixtures/config.object.options'
			},
			accept: [
				{
					files: './fixtures/reject.errors.scss'
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
					code: '@use "sass:math";'
				}
			],
			reject: [
				{
					code: '@use "loki";',
					result: {
						line: 1,
						column: 1,
						text: messages.report(
							"Can't find stylesheet to import."
						)
					}
				},
				{
					code: '@use "sass:color"; .becky { color: color.invert(1); }',
					result: {
						line: 1,
						column: 36,
						text: messages.report(
							'Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1).'
						)
					}
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
					code: '@use "loki";'
				}
			],
			reject: []
		});
	});
});
