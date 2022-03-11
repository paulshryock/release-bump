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

<details>
  <summary>TypeScript</summary>

  ```bash
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

  ```bash
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

## Contributing

todo

## License

[Hippocratic 2.1](LICENSE)

## Contact

todo

## Acknowledgments

todo