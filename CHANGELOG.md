# Changelog

## [Unreleased][]

## [4.0.2][] - 2024-08-23

-   Update Sass import identifier

## [4.0.1][] - 2024-04-21

-   Update types referencing

## [4.0.0][] - 2024-04-18

### Changed

-   Use [new Sass API](https://sass-lang.com/documentation/js-api/)
-   Use new logger JS API for simpler deprecation parsing

### Removed

-   CommonJS support, only ESM is supported
-   Node 10 support, lowest version is 18.12
-   Legacy Sass support, lowest version is 1.75

## [3.2.1][] - 2024-02-26

### Changed

-   Allow Stylelint 16 as peer dependancy

## [3.2.0][] - 2023-09-25

### Added

-   Add support for additional known CSS functions

## [3.1.0][] - 2023-08-24

### Changed

-   Allow Stylelint 15 as peer dependancy
-   Use pure ESM as default
-   Upgrade package

## [3.0.2][] - 2023-07-23

### Fixed

-   Calculate proper offset for non-CSS starting line ([#3](/issues/3))

## [3.0.1][] - 2023-05-01

### Changed

-   Bump package version to fetch related Sass dependencies
-   Update types

## [3.0.0][] - 2021-10-26

### Changed

-   **Breaking**: Supports Node >= 12
-   **Breaking**: Supports Stylelint >= 14
-   Upgrade package

## [2.1.0][] - 2021-09-30

### Added

-   Support for disallowed known CSS functions

## [2.0.1][] - 2021-09-09

### Changed

-   Return unique collection of errors

## [2.0.0][] - 2021-09-08

### Changed

-   Rename `renderMode` to `sync`

## [1.1.0][] - 2021-09-06

### Added

-   Support for checking undefined functions

### Fixed

-   Get closest node with error
-   Handle standard input

## [1.0.0][] - 2021-09-01

### Added

-   Initial implementation

[1.0.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v1.0.0
[1.1.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v1.1.0
[2.0.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v2.0.0
[2.0.1]: https://github.com/niksy/stylelint-sass-render-errors/tree/v2.0.1
[2.1.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v2.1.0
[3.0.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.0.0
[3.0.1]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.0.1
[3.0.2]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.0.2
[3.1.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.1.0
[Unreleased]: https://github.com/niksy/stylelint-sass-render-errors/compare/v4.0.2...HEAD
[4.0.2]: https://github.com/niksy/stylelint-sass-render-errors/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/niksy/stylelint-sass-render-errors/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/niksy/stylelint-sass-render-errors/compare/v3.2.1...v4.0.0
[3.2.1]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.2.1

    https://github.com/niksy/stylelint-sass-render-errors/compare/v3.2.0...HEAD

[3.2.0]: https://github.com/niksy/stylelint-sass-render-errors/tree/v3.2.0
