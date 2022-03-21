# Release Bump

Handle version bump tasks for a code release. Use `unreleased` in your Changelog and docblock comments, and Release Bump will automatically bump it to the correct release version.

- 🔋 0 dependencies
- ⌨️ CLI is 6kb
- 🔌 API is 4kb

> Release Bump 1.x and 2.x are officially deprecated and no longer supported. Please use Release Bump 3.x or higher.

## Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [Node 8 support](#node-8-support)
  - [Installation](#installation)
- [Usage](#usage)
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

Node ^14, or Node ^8 with a polyfill.

See `engines.node` in `package.json` for required Node version in development.

#### Node 8 support

To extend support back to Node 8, you'll need to install a polyfill for `fs/promises` and require the polyfill when you execute the `release-bump` binary. This is not officially supported, as I don't maintain the `fs/promises` polyfill. **Use at your own risk.**

```bash
$ npm install --save-dev fs.promises
$ node -r fs.promises ./node_modules/.bin/release-bump -- <options>
```

### Installation

```bash
npm install --save-dev release-bump
```

## Usage

<details>
  <summary>CLI</summary>

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
</details>
<details>
  <summary>Config files</summary>

  <p>Config files coming soon.</p>
</details>
<details>
  <summary>TypeScript</summary>

  ```typescript
  import { releaseBump, ReleaseBumpOptions } from 'release-bump'

  ;(async function() {
    const options: ReleaseBumpOptions = {
      changelogPath: 'CHANGELOG.md',
      date: '2022-03-11',
      filesPath: '.',
      release: '3.0.0',
    }
    await releaseBump(options)
  })()

  ```
</details>
<details>
  <summary>JavaScript</summary>

  ```javascript
  import { releaseBump } from 'release-bump'

  ;(async function() {
    const options = {
      changelogPath: 'CHANGELOG.md',
      date: '2022-03-11',
      filesPath: '.',
      release: '3.0.0',
    }
    await releaseBump(options)
  })()

  ```
</details>

## Roadmap

1. [x] Core API
2. [x] CLI
3. [ ] Config files

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md).

## License

[Hippocratic 2.1](LICENSE)

## Contact

- [Ask a question](https://github.com/paulshryock/release-bump/discussions/new)
- [Request a feature](https://github.com/paulshryock/release-bump/issues/new?assignees=&labels=&template=feature_request.md&title=)
- [Report a bug](https://github.com/paulshryock/release-bump/issues/new?assignees=&labels=&template=bug_report.md&title=)

## Acknowledgments

You're awesome.