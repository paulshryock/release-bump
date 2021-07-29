# `release-bump`

`release-bump` handles version bump tasks for a code release.

## Announcements

Version `2.2.0` adds unit tests, code linting, and [CLI](#cli) and [JavaScript API](#javascript-api) configuration for `quiet`.

Version `2.1.0` adds [CLI](#cli) and [JavaScript API](#javascript-api) configuration for `prefix`.

Version `2.0.0` includes breaking changes:
- CLI configuration has been removed
- JavaScript API configuration has been removed
- [JavaScript class instantiation](#javascript-api) should be followed by a call to `init()` inside an async function.

## Requirements

| Software | Minimum version | Tested version | Tested date |
| :--- | :--- | :--- | :--- |
| Node | `^14.14.0` | `16.5.0` | 2021/07/29 |
| npm | `^3.0.0` | `7.20.3` | 2021/07/29 |

## Features

- [Bump Changelog](#bump-changelog)
- [Bump WordPress theme or plugin](#bump-wordpress-theme-or-plugin)

[View roadmap](https://github.com/paulshryock/release-bump/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

### Bump Changelog

If your project has a Changelog, add lines beneath the Unreleased header as you make changes.

`release-bump` will change this:

```bash
## [Unreleased]

### Added
- Add my new feature.

### Changed

### Deprecated

### Removed

### Fixed
- Fix a bug.
- Fix another bug.

### Security
```

to this:

```bash
## [Unreleased](https://example.com/repo/compare/HEAD..1.0.0)

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0](https://example.com/repo/releases/tags/v1.0.0) - 3/30/2021

### Added
- Add my new feature.

### Fixed
- Fix a bug.
- Fix another bug.
```

### Bump WordPress theme or plugin

If your project has a file named `style.css` or a PHP file of the folder name in the root directory, it will bump the version.

`release-bump` will change this:

```css
/*
...
Version: 0.0.1
...
*/
```

to this:

```css
/*
...
Version: 1.0.0
...
*/
```

## Usage

### Install

```bash
npm i -D release-bump
```

### CLI

Add `release-bump` to a `version` npm script.

```
{
  "scripts": {
    "version": "release-bump && git add ."
  }
}
```

Now whenever you run `npm version <major|minor|patch>`, all of the `release-bump` tasks will execute with the new version number before npm creates a version commit.

#### Configuration

```bash
Options
  --prefix, -p  Include a "v" prefix before the version number.
  --quiet,  -q  Silence console logs.

  --help        Log this help text.
  --version     Log the installed release-bump version.
```

### JavaScript API

If you prefer to run `release-bump` programmatically, just require and instantiate a `release-bump` class inside an async function; then call `init()`:

```javascript
import Bump from 'release-bump'

;(async function () {
  const bump = new Bump()
  await bump.init()
})();
```

#### Configuration

##### `prefix`

Include a "v" prefix before the version number.

- Type: `boolean`
- Default: `false`
- Optional: `true`

##### `quiet`

Silence console logs.

- Type: `boolean`
- Default: `false` (`true` during tests)
- Optional: `true`

```javascript
import Bump from 'release-bump'

const options = {
  prefix: true,
  quiet: true,
}

const bump = new Bump(options)
await bump.init()
```

## Development

### Linting

- `npm run lint`: Lint code.

### Testing

- `npm test`: Run Ava unit tests.
- `npm run test:watch`: Run Ava unit tests and watch for changes.
- `npm run test:coverage`: Run Ava unit tests and see test coverage.
