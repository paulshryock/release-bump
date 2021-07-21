import { $, chalk, fs } from 'zx'
import { writeFile } from 'fs/promises'
import { get } from './utils/file.js'

$.verbose = false

export default class Changelog {
  constructor (options = {}) {
    try {
      const { prefix, remote, repository, today, version } = options
      if (!remote || !repository || !today || !version) {
        throw new Error('Could not bump changelog.')
      }

      this.prefix = prefix
      this.remote = remote
      this.repository = repository
      this.today = today
      this.version = version
      this.path = 'CHANGELOG.md'
      this.header = `## [${this.version}](${this.repository}/` +
        `${this.remote === 'bitbucket' ? 'commits/tag' : 'releases/tag'}/` +
        `${this.prefix}${this.version}) - ${this.today}`
      this.unreleased =
        `## [Unreleased](${this.repository}/` +
          `${this.remote === 'bitbucket' ? 'branches/' : ''}` +
          `compare/HEAD..${this.prefix}${this.version})` +
        '\n\n### Added' +
        '\n\n### Changed' +
        '\n\n### Deprecated' +
        '\n\n### Removed' +
        '\n\n### Fixed' +
        '\n\n### Security'
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }

  async init () {
    try {
      const file = await get({ path: this.path })
      if (!file) {
        console.log(chalk.yellow('No Changelog to bump.'))
        return
      }

      this.text = file
      this.new = this.text
        // Bump unreleased version and add today's date.
        .replace(/## \[Unreleased\](\(.*\))?/, this.header)
        // Remove empty changelog subheads.
        .replace(
          /### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,
          ''
        )
        // Remove last empty changelog subhead.
        .replace(
          /### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,
          ''
        )
        // Remove any duplicate trailing newline.
        .replace(/\n\n$/g, '\n')
        // Add unreleased section.
        .replace(
          this.header,
          this.unreleased + '\n\n' + this.header
        )
      writeFile(this.path, this.new, 'utf8')
      console.log(chalk.green('Bumped Changelog.'))
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }
}
