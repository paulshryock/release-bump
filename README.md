# Release Bump

Release Bump handles version bump tasks for a code release.

## Features

[View roadmap](https://github.com/paulshryock/release-bump/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

### Bump Changelog

From this:

```bash
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

Now whenever you run `npm version <major|minor|patch>`, all of the Release Bump tasks will execute with the new version number before npm creates a version commit.

### JavaScript API

If you prefer to run Release Bump programattically, just require Release Bump as a class and instantiate it:

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
    includeV: true,
    initialText: '',
    initialTextUrl: 'https://keepachangelog.com/en/1.0.0/',
    remote: 'github',
  }
})
```

#### Configuration

| Option                     | Type    | Default                                | Description                          |
| :---                       | :---    | :---                                   | :---                                 |
| `changelog`                | Object  |                                        | The Changelog options.               |
| `changelog.filePath`       | string  | `./CHANGELOG.md`                       | The Changelog file path.             |
| `changelog.includeV`       | boolean | `true`                                 | Whether to include v in the version. |
| `changelog.initialText`    | string  | empty string                           | The initial Changelog text.          |
| `changelog.initialTextUrl` | string  | `https://keepachangelog.com/en/1.0.0/` | The initial Changelog text URL.      |
| `changelog.remote`         | string  | `github`                               | Accepts `github` or `bitbucket`.     |
