# Contributing guidelines

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

1. Use intentional [commits](https://github.com/git-guides/git-commit)

> You should make new commits often, based around logical units of change. Over time, commits should tell a story of the history of your repository and how it came to be the way that it currently is. Commits include lots of metadata in addition to the contents and message, like the author, timestamp, and more.

2. Use [atomic commits](https://www.aleksandrhovhannisyan.com/blog/atomic-git-commits/)

> Atomic commits are responsible for documenting a single, complete unit of work. This doesn’t mean that each commit needs to be limited to a single file or only a few lines of code (but if that’s the case, then so be it). Rather, it means that you should be able to describe your changes with a single, meaningful message without trying to tack on additional information about some unrelated work that you did. Another way to define an atomic commit is one that can be reverted without any unwanted side effects or regressions, aside from what you’d expect based on its message. If a commit is removed from your git commit history but doing so removes other legitimate changes, then that commit wasn’t atomic.

3. [Write better commit messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)

> By writing good commits, you are simply future-proofing yourself. You could save yourself and/or coworkers hours of digging around while troubleshooting by providing that helpful description. The extra time it takes to write a thoughtful commit message as a letter to your potential future self is extremely worthwhile. On large scale projects, documentation is imperative for maintenance.

4. [Format your commits](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

> More important than the mechanics of formatting the body is the practice of having a subject line. As the example indicates, you should shoot for about 50 characters (though this isn’t a hard maximum) and always, always follow it with a blank line. This first line should be a concise summary of the changes introduced by the commit; if there are any technical details that cannot be expressed in these strict size constraints, put them in the body instead. The subject line is used all over Git, oftentimes in truncated form if too long of a message was used.

5. Sign your commits

- [GitHub](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [Bitbucket](https://confluence.atlassian.com/bitbucketserver/using-gpg-keys-913477014.html)

### Pull requests

Never commit directly to the `main` branch. Work on a short-lived feature branch and then create a pull request against `main`. When you push code to the remote, CI will automatically run code quality checks and ensure that your source code compiles. These checks must pass before merging your PR, and you must have an approval from another engineer.

- _Fast forward (`rebase` and `merge`):_ Use [linear history](https://devblog.nestoria.com/post/98892582763/maintaining-a-consistent-linear-history-for-git).

- _Squash:_ If you have multiple or messy commits which should be combined into one on the `main` branch, squash your pull request with a descriptive commit message.

- _Merge commit (`merge --no-ff`):_ [You probably don't need this](https://dev.to/bladesensei/avoid-messy-git-history-3g26).

### Tags

Use [SemVer](https://semver.org/) git tags to reference a specific point in the git history. See [examples of valid and invalid SemVer tags](https://regex101.com/r/vkijKf/1/). Version commits are automatically tagged when running `npm version`.

## Code quality

A number of automated tools are in place to enforce code quality through formatting, linting, type-checking, static analysis, and unit testing.

### Code formatting

Code formatting should be handled automatically by formatting tools like EditorConfig and Prettier. This ensures a consistent format across the repository, and it ensures that time isn't wasted in code reviews on formatting choices. Engineers should never need to think about whether to use tabs vs spaces, for example. This is a waste of time.

Code formatting **should not** be handled by linters such as ESLint or PHPCS. There are many reasons that [formatting and linting should remain separate](https://typescript-eslint.io/docs/linting/troubleshooting/formatting).

**A CI build should never fail (and a release should never be blocked) because of a formatting issue.**

- **Do**: Format code before commiting it.
- **Do not**: Format code during CI.

#### Our formatting conventions

We use EditorConfig and Prettier with some configuration.

1. **Line length set to 80 characters** (with soft limit at 120 characters and exceptions for data files)

   > Shorter lines are more comfortable to read than longer lines. As line length increases, your eye has to travel farther from the end of one line to the beginning of the next, making it harder to track your progress vertically. Aim for an average line length of 45–90 characters, including spaces.
   >
   > -- [Butterick's Practical Typography](https://practicaltypography.com/line-length.html)

2. **Tabs for indenting** (with exceptions for white space-sensitive data files)

- [Tabs are more accessible](https://alexandersandberg.com/articles/default-to-tabs-instead-of-spaces-for-an-accessible-first-environment/)
- [Tabs are customizable](https://garrit.xyz/posts/2022-06-29-the-only-true-answer-to-tabs-vs-spaces) (use whatever tab size you like on your computer)

3. Insert final newline at end of file: [Text files end in a newline](https://unix.stackexchange.com/a/18789)

4. In function and method declarations, the opening brace SHOULD stay on the same line

   ```javascript
   function hello() {
     return 'hello'
   }
   ```

#### EditorConfig

> [EditorConfig](https://editorconfig.org/) helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The EditorConfig project consists of a **file format** for defining coding styles and a collection of **text editor plugins** that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

To integrate EditorConfig with your editor of choice, [install the appropriate plugin](https://editorconfig.org/#download).

#### Prettier

> [Prettier](https://prettier.io/) is an opinionated code formatter.

### Linting

Linting should be handled automatically by a linter like ESLint. This ensures incorrect syntax and code smells are detected before code makes it into review, which saves time during code review.

**A CI build should fail (and a release should be blocked) because of a linting issue.**

- **Do**: Lint code before commiting it.
- **Do**: Lint code during CI.

### Static analysis and type-checking

Code is analyzed and type-checked before committing, before merging and while compiling to prevent runtime errors.

### Testing

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

Code is released by pushing a [SemVer](https://semver.org/) release tag to the remote and publishing on npm.

### Release tags

To create a major, minor, or patch release, use `npm version <major|minor|patch>` and `git push --tags`.

#### Prerelease tags

To release code under a prerelease tag before a formal release is ready, use `npm version <premajor|preminor|prepatch|prerelease> --preid=<prerelease-id>` and `git push --tags`.

##### Prerelease ID's

| ID        | Feature status                          | Bug status     | Testing status                     |
| :-------- | :-------------------------------------- | :------------- | :--------------------------------- |
| `nightly` | May not have any complete features yet. | May have bugs. | Not ready for testing.             |
| `alpha`   | At least 1 feature is complete.         | May have bugs. | Ready for developer testing.       |
| `beta`    | All features are complete.              | May have bugs. | Ready for QA testing.              |
| `rc`      | Release candidate.                      | Stable.        | Ready for user acceptance testing. |

### Publishing

Code is published to npm using `npm publish`. See `files` in `package.json` for the list of included package files.
