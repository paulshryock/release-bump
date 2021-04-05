# `release-bump`

`release-bump` handles version bump tasks for a code release.

## Features

[View roadmap](https://github.com/paulshryock/release-bump/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

### Bump Changelog

Add lines to your Changelog beneath the Unreleased header as you make changes. 

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

| Option | Type    | Default                                | Description                            |
| :---   | :---    | :---                                   | :---                                   |
| `-h`   | boolean | `false`                                | Log help information.                  |
| `-p`   | string  | `./CHANGELOG.md`                       | The Changelog file path.               |
| `-r`   | string  | `github`                               | The Git remote. (`github`|`bitbucket`) |
| `-s`   | boolean | `false`                                | Whether to skip `v` in the version.    |
| `-t`   | string  | empty string                           | The initial Changelog text.            |
| `-u`   | string  | `https://keepachangelog.com/en/1.0.0/` | The initial Changelog text URL.        |
| `-v`   | boolean | `false`                                | Log package version.                   |

### JavaScript API

If you prefer to run `release-bump` programattically, just require and instantiate a `release-bump` class:

```javascript
const Bump = require('release-bump')
new Bump()
```

Pass configuration options if you want to override the defaults:

```javascript
const Bump = require('release-bump')
new Bump({
  changelog: {
    filePath: './CHANGELOG.md',
    gitRemote: 'github',
    initialText: '',
    initialTextUrl: 'https://keepachangelog.com/en/1.0.0/',
    skipV: false,
  },
  help: false,
  version: false,
})
```

#### Configuration

| Option                     | Type    | Default                                | Description                            |
| :---                       | :---    | :---                                   | :---                                   |
| `changelog`                | Object  |                                        | The Changelog options.                 |
| `changelog.filePath`       | string  | `./CHANGELOG.md`                       | The Changelog file path.               |
| `changelog.gitRemote`      | string  | `github`                               | The Git remote. (`github`|`bitbucket`) |
| `changelog.initialText`    | string  | empty string                           | The initial Changelog text.            |
| `changelog.initialTextUrl` | string  | `https://keepachangelog.com/en/1.0.0/` | The initial Changelog text URL.        |
| `changelog.skipV`          | boolean | `false`                                | Whether to skip `v` in the version.    |
| `help`                     | boolean | `false`                                | Whether to log help information.       |
| `version`                  | boolean | `false`                                | Whether to log package version.        |
