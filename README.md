# Release Bump

Release Bump handles version bump tasks for a code release.

## Roadmap

- [x] Bump Changelog
- [ ] Bump docblock comments
- [ ] Add CLI flag configuration

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
