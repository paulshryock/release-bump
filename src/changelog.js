import { $, chalk } from 'zx'
import { mkdir, writeFile } from 'fs/promises'
import { parse } from 'path'
import { getFileContent } from './utils/file.js'
import { getType } from './utils/type.js'

$.verbose = false

/**
 * Changelog class.
 *
 * @since 2.0.0
 */
export default class Changelog {
  #header
  #today
  #unreleased

  /**
   * Changelog class constructor.
   *
   * @param {Object} options Configuration options.
   * @since 2.0.0
   */
  constructor (options = {}) {
    const [month, date, year] = new Date()
      .toLocaleDateString('en-US')
      .split('/')
    const formattedMonth = month < 10 ? `0${month}` : month
    const formattedDate = date < 10 ? `0${date}` : date
    this.#today = `${year}/${formattedMonth}/${formattedDate}`

    try {
      const {
        path,
        prefix,
        quiet,
        remote,
        repository,
        version,
      } = options
      const defaults = {
        path: 'CHANGELOG.md',
        prefix: '',
        quiet: false,
        remote: undefined,
        repository: undefined,
        version: undefined,
      }

      this.path = path && getType(path) === 'string' ? path : defaults.path
      this.prefix = prefix && getType(prefix) === 'string' ? prefix : defaults.prefix
      this.quiet = process.env.NODE_ENV === 'test'
        ? true
        : (getType(quiet) === 'boolean'
            ? quiet
            : defaults.quiet)
      this.remote = remote && getType(remote) === 'string' ? remote : defaults.remote
      this.repository = repository && getType(repository) === 'string'
        ? repository
        : defaults.repository
      this.version = version && getType(version) === 'string' ? version : defaults.version
      this.#header = `## [${this.version}](${this.repository}/` +
        `${this.remote === 'bitbucket' ? 'commits/tag' : 'releases/tag'}/` +
        `${this.prefix}${this.version}) - ${this.#today}`
      this.#unreleased =
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

  /**
   * Initialize async tasks.
   *
   * @since 2.2.0
   */
  async init () {
    try {
      // Handle async setup tasks.
      await this.setup()

      // Bump.
      await this.bump()
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }

  /**
   * Handle async setup tasks.
   *
   * @since 2.2.0
   */
  async setup () {
    if (
      !this.path ||
      !this.remote ||
      !this.repository ||
      !this.#today ||
      !this.#unreleased ||
      !this.version
    ) {
      throw new Error('Could not bump changelog.')
    }

    try {
      const text = await getFileContent({ path: this.path })
      if (!text) {
        if (!this.quiet) {
          console.log(chalk.yellow('No Changelog to bump, or Changelog empty.'))
        }
        return
      }

      this.text = text
      this.new = this.text
        // Bump unreleased version and add today's date.
        .replace(/## \[Unreleased\](\(.*\))?/, this.#header)
        // Remove empty changelog subheads.
        .replace(
          /### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,
          '',
        )
        // Remove last empty changelog subhead.
        .replace(
          /### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,
          '',
        )
        // Remove any duplicate trailing newline.
        .replace(/\n\n$/g, '\n')
        // Add unreleased section.
        .replace(
          this.#header,
          this.#unreleased + '\n\n' + this.#header,
        )
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }

  /**
   * Bump.
   *
   * @since 2.2.0
   */
  async bump () {
    try {
      const directory = parse(this.path).dir
      if (directory) await mkdir(directory, { recursive: true })
      await writeFile(this.path, this.new, 'utf8')
      if (!this.quiet) console.log(chalk.green('Bumped Changelog.'))
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }
}
