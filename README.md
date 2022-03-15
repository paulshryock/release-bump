# Release Bump

Handle version bump tasks for a code release. Use `unreleased` in your Changelog and docblock comments, and Release Bump will automatically bump it to the correct release version.

✅ 0 dependencies
✅ CLI is under 7kb
✅ API is under 4kb

## Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Getting started

```bash
npm install --save-dev release-bump
```

```json
// package.json
{
  "scripts": {
    "preversion": "release-bump <options>"
  }
}
```

### Prerequisites

Node ^8

### Installation

```bash
npm install -D release-bump
```

## Usage

CLI coming soon.

Config files coming soon.

<details>
  <summary>TypeScript</summary>

  ```typescript
  import { ReleaseBump, ReleaseBumpOptions } from 'release-bump'

  ;(async function() {
    const options: ReleaseBumpOptions = {
      changelogPath: 'CHANGELOG.md',
      date: '2022-03-11',
      filesPath: '.',
      release: '3.0.0',
    }
    const releaseBump = new ReleaseBump(options)
    await releaseBump.init()
  })()

  ```
</details>

<details>
  <summary>JavaScript</summary>

  ```javascript
  import { ReleaseBump } from 'release-bump'

  ;(async function() {
    const options = {
      changelogPath: 'CHANGELOG.md',
      date: '2022-03-11',
      filesPath: '.',
      release: '3.0.0',
    }
    const releaseBump = new ReleaseBump(options)
    await releaseBump.init()
  })()

  ```
</details>

## Roadmap

1. [x] Core API
2. [ ] CLI
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

Thanks `meow` for CLI args.