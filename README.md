# stylelint-sass-render-errors

[![Build Status][ci-img]][ci]

Display Sass render errors and deprecations as lint errors.

Implementation details:

-   Sass deprecations are treated same as errors since
    [Sass tries to move language forward](https://github.com/sass/libsass/issues/2822#issuecomment-482914373)
    and each deprecation should be corrected as soon as possible in your
    codebase
-   Plugin operates on each file in isolation so if you have global `@import`
    statements, they won’t be applied and you could get errors for e.g.
    undefined variables. Recommendation is to switch to
    [Sass modules](https://sass-lang.com/documentation/modules) and
    [`@use`/`@forward` statements](https://sass-lang.com/documentation/at-rules/use)
-   Sass (_only Dart Sass is supported_) should be installed as peer dependancy
    because each version has different set of errors and deprecations and you
    should get results for Sass version your application uses

## Install

```sh
npm install stylelint-sass-render-errors --save-dev
```

## Usage

Add this config to your `.stylelintrc`:

```json
{
	"plugins": ["stylelint-sass-render-errors"],
	"rules": {
		"plugin/sass-render-errors": true
	}
}
```

<!-- prettier-ignore-start -->

```scss
@use 'sass:color';
@use 'sass:math';

.becky {
    color: color.invert(1);
/**        ↑
 * Passing a number (1) to color.invert() is deprecated. Recommendation: invert(1). */
}

#marley {
    width: math.percentage(100 / 2);
/**                        ↑
 * Using / for division is deprecated and will be removed in Dart Sass 2.0.0. Recommendation: math.div(100, 2). More info and automated migrator: https://sass-lang.com/d/slash-div. */
}
```

<!-- prettier-ignore-end -->

## Options

Plugin accepts either boolean (`true`) or object configuration.

If boolean, it will use default configuration:

-   `sass.render` for rendering Sass files and resolving errors and deprecations
-   No options for Sass renderer other than `file` if file is linted or `data`
    if CSS string is linted

If object configuration, following properties are valid:

### renderMode

Type: `string`  
Default: `async`

Rendering mode for Sass render. Can be either `async` for `sass.render` or
`sync` for `sass.renderSync`. This way you can
[leverage faster rendering without using Fibers](https://github.com/sass/dart-sass#javascript-api).

### sassOptions

Type: `object|string`

If object, it is
[Sass options](https://github.com/sass/dart-sass#javascript-api) object. For
detailed explanation see
[node-sass options reference](https://github.com/sass/node-sass#options).

If string, it is config file location which returns one of the following default
exports:

-   Sass options object
-   Async or regular function returning Sass options object

Config file location is [resolved](https://github.com/sindresorhus/resolve-from)
relatively from the
[closest `package.json` location](https://github.com/sindresorhus/pkg-up) inside
current working directory.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/stylelint-sass-render-errors
[ci-img]: https://travis-ci.com/niksy/stylelint-sass-render-errors.svg?branch=master

<!-- prettier-ignore-end -->
