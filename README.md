# Release Bump

Handle version bump tasks for a code release.

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Getting Started

todo

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
      date: '2022-01-01',
      dryRun: false,
      files: [
        'src/ts/script.ts',
        'src/scss/style.scss',
      ],
      quiet: true,
      prefix: 'v',
      remote: 'github',
      repository: 'my-org/some-repo',
      version: '1.0.0',
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
      date: '2022-01-01',
      dryRun: false,
      files: [
        'src/ts/script.ts',
        'src/scss/style.scss',
      ],
      quiet: true,
      prefix: 'v',
      remote: 'github',
      repository: 'my-org/some-repo',
      version: '1.0.0',
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

Thanks `globby` and sub-dependencies. Globs are hard.