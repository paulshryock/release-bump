# How to contribute

- [Local environment](#local-environment)
- [Dependencies](#dependencies)
- [Git](#git)
  - [Branches](#branches)
  - [Commits](#commits)
  - [Pull requests](#pull-requests)
  - [Tags](#tags)
- [Code quality](#code-quality)
  - [During development](#during-development)
  - [Skipping code quality checks](#skipping-code-quality-checks)
- [Releases](#releases)
  - [Release tags](#release-tags)
  - [Prerelease tags](#prerelease-tags)
    - [Prerelease ID's](#prerelease-ids)
  - [Publishing](#publishing)

## Local environment

Follow the [quick start guide](README.md#quick-start) to get a local development environment up and running.

## Dependencies

npm dependencies are pinned in both `package.json` and `package-lock.json`. [Renovate](https://app.renovatebot.com/dashboard#github/paulshryock/release-bump) will automatically submit PR's for dependency upgrades, and [Socket](https://socket.dev/) will automatically submit PR's for dependency vulnerability remediation.

On each `git pull`, a husky hook will also notify of any new dependency upgrades available.

## Git

### Branches

This repository uses [Trunk Based Development](https://trunkbaseddevelopment.com/), where developers collaborate on code in a single branch called `main`, and resist any pressure to create other long-lived development branches. **Short-lived feature branches** are used by one person over a couple of days (max), and will flow through pull-request style code review & build automation before "integrating" (merging) into the `main` branch.

### Commits

By using [commits](https://github.com/git-guides/git-commit), you're able to craft history intentionally and safely. Please use [correctly formatted commit messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

#### Commit messages

At a minimum, commit messages should include:
1. a capitalized, short summary
2. a ticket number preceeded by a hash, enclosed in parenthesis

```
Add some cool new feature (#1)
```

Pull request commit or squash messages should include:
1. a capitalized, short summary
2. a ticket number preceeded by a hash, enclosed in parenthesis
3. a pull request number preceeded by a hash, enclosed in parenthesis

```
Add some cool new feature (#1) (#2)
```

> More important than the mechanics of formatting the body is the practice of having a subject line. You should shoot for about 50 characters (though this isn???t a hard maximum) and always, always follow it with a blank line. This first line should be a concise summary of the changes introduced by the commit; if there are any technical details that cannot be expressed in these strict size constraints, put them in the body instead. The subject line is used all over Git, oftentimes in truncated form if too long of a message was used.

#### Signed commits

Please [sign your commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).

### Pull requests

Never commit directly to the `main` branch. You should always work on a short-lived feature branch and then create a pull request against `main`. When you push code to the remote, CI will automatically run code quality checks and ensure that your source code compiles. These checks must pass before merging your PR, and you must have an approval from another engineer.

- *Merge commit:* If the commit history on your branch is all setup correctly and ideal for the main branch, and there's a reason you need an additional commit, use a merge commit with a descriptive commit message.
- *Squash:* If the commit history on your branch is not ideal for the main branch, squash your changes together into a single commit with a descriptive commit message.
- *Fast forward (rebase):* If the commit history on your branch is all setup correctly and ideal for the main branch, then use fast forward/rebase to retain the commit history of your branch.

**You should almost always squash pull requests.** Only use a merge commit if there is a good reason to preserve your feature branch's full commit history.

### Tags

Use git tags to reference a specific point in the git history. Version commits are automatically tagged when running `npm version`.

[Full RegExp with examples of valid SemVer](https://regex101.com/r/vkijKf/1/).

## Code quality

A number of automated tools are in place to enforce code quality through formatting, linting, type-checking, static analysis, and unit testing.

### During development

Many code editors will support formatting, linting, type-checking, static analysis, and autocompletion during development either by default, or with relevant plugins installed. You can run individual checks (and optionally watch for changes) from the terminal. See `package.json` for all available scripts.

Run through all code quality checks manually:

```bash
npm run quality
```

A pre-commit hook will enforce code quality before code is committed. **Don't skip code quality checks.**

### Skipping code quality checks

If you need to save code which doesn't pass code quality checks, and `git stash` is not a suitable option, you can use `git commit --no-verify`. Later you can run `git commit --amend` to add passing code to your latest commit and re-run code quality checks.

**You must run your code through code quality checks before pushing to remote and setting up a pull request.**

## Releases

Code is released by pushing a release tag to the remote and publishing on npm.

### Release tags

To create a major, minor, or patch release, use `npm version <major|minor|patch>` and `git push --tags`.

#### Prerelease tags

To release code under a prerelease tag before a formal release is ready, use `npm version <premajor|preminor|prepatch|prerelease> --preid=<prerelease-id>` and `git push --tags`.

##### Prerelease ID's

| ID        | Feature status                          | Bug status     | Testing status                     |
| :---      | :---                                    | :---           | :---                               |
| `nightly` | May not have any complete features yet. | May have bugs. | Not ready for testing.             |
| `alpha`   | At least 1 feature is complete.         | May have bugs. | Ready for developer testing.       |
| `beta`    | All features are complete.              | May have bugs. | Ready for QA testing.              |
| `rc`      | Release candidate.                      | Stable.        | Ready for user acceptance testing. |

### Publishing

Code is published to npm using `npm publish`. See `files` in `package.json` for the list of included package files.