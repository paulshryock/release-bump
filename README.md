# Release Bump

![Enforce code quality](https://github.com/paulshryock/release-bump/actions/workflows/quality.yml/badge.svg)
![Compile source code](https://github.com/paulshryock/release-bump/actions/workflows/compile.yml/badge.svg)

Bumps Changelog, docblock, and WordPress theme/plugin versions for a code release.

Use `unreleased` in your Changelog and docblock comments, and Release Bump will automatically bump it to the correct release version.

**This package writes to your file system.**

- ☝️ Only does one thing
- 👌 Zero production dependencies
- 🤏 API is <8kb, CLI is 4kb
- 🤙 Supports ESM and Common JS
- 🤘 TypeScript types included
- 🙌 No ads, no analytics, no tracking

Release Bump was developed to solve the problem of wanting to update a project's Changelog, and add docblock `@since` comments to source code, without yet knowing the next release version. Instead of guessing whether the next release is a major, minor, or patch release, we should be able to just write `unreleased`, and have the version number bump to the correct version automatically at release time.

This becomes especially important while working on a team. Perhaps I've fixed a bug, and so I suspect the next release is a patch. But later, a team mate adds a new feature. So is the next release minor? Perhaps later we end up with some backwards-incompatible API-breaking changes. So maybe the next release is major. We shouldn't need to worry about what the next version is going to be until it's actually time for the release.

## Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [TypeScript](#typescript)
  - [JavaScript](#javascript)
  - [Config files](#config-files)
- [Node 8 support](#node-8-support)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Getting started

```bash
$ npm install --save-dev release-bump
$ release-bump --help

  Usage
    $ release-bump <options>

  Options
    --changelogPath   Path to changelog.
    --date            Release date.
    --dryRun       -d Dry run.
    --failOnError  -e Fail on error.
    --filesPath       Path to directory of files to bump.
    --ignore          Directories to ignore.
    --help         -h Log CLI usage text.
    --prefix       -p Prefix release version with a 'v'.
    --quiet        -q Quiet, no logs.
    --release         Release version.
    --repository      Remote git repository URL.
    --version      -v Log Release Bump version.

  Examples
    $ release-bump -pq --files=src
```

### Prerequisites

[Node](https://nodejs.org/en/download/package-manager/) ^14, or Node ^8 [with a polyfill](#node-8-support).

See `.nvmrc` for required Node version in development.

### Installation

```bash
npm install --save-dev release-bump
```

## Usage

### CLI

If you install this module globally, you can use the `release-bump` binary as it will be in your path. Otherwise if you install locally per-project, you'll need to use `./node_modules/.bin/release-bump` or `npx release-bump`.

```bash
Usage
  $ release-bump <options>

Options
  --changelogPath   Path to changelog.
  --date            Release date.
  --dryRun       -d Dry run.
  --failOnError  -e Fail on error.
  --filesPath       Path to directory of files to bump.
  --ignore          Directories to ignore.
  --help         -h Log CLI usage text.
  --prefix       -p Prefix release version with a 'v'.
  --quiet        -q Quiet, no logs.
  --release         Release version.
  --repository      Remote git repository URL.
  --version      -v Log Release Bump version.

Examples
  $ release-bump -pq --files=src

```

### TypeScript

```typescript
import { releaseBump, ReleaseBumpOptions } from 'release-bump'

const options: ReleaseBumpOptions = {
  changelogPath: 'CHANGELOG.md',
  date: '2022-03-11',
  filesPath: '.',
  release: '3.0.0',
}
await releaseBump(options)

```

### JavaScript

```javascript
import { releaseBump } from 'release-bump'

const options = {
  changelogPath: 'CHANGELOG.md',
  date: '2022-03-11',
  filesPath: '.',
  release: '3.0.0',
}
await releaseBump(options)

```

### Config files

Config files coming soon.

## Node 8 support

To extend support back to Node 8, you'll need to install a polyfill for `fs/promises` and require the polyfill when you execute the `release-bump` binary. This is not officially supported, as I don't maintain the `fs/promises` polyfill. **Use at your own risk.**

```bash
$ npm install --save-dev fs.promises
$ node -r fs.promises ./node_modules/.bin/release-bump -- <options>
```

## Roadmap

1. ✅ Core API
2. ✅ CLI
3. 🚧 Config files
4. Refactor tests with datasets
5. 🚧 Docs
6. Polish

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md).

## License

[MIT](LICENSE)

## Contact

- [Ask a question](https://github.com/paulshryock/release-bump/discussions/new)
- [Request a feature](https://github.com/paulshryock/release-bump/issues/new?assignees=&labels=&template=feature_request.md&title=)
- [Report a bug](https://github.com/paulshryock/release-bump/issues/new?assignees=&labels=&template=bug_report.md&title=)

## Acknowledgments

You're awesome.
