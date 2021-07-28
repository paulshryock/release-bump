import { $, chalk } from 'zx'
import Git from './Git.js'
import Changelog from './Changelog.js'
import WordPress from './WordPress.js'
import { readFile } from 'fs/promises'
import { getType } from './utils/type.js'

$.verbose = false

/**
 * Bump class.
 *
 * @since 2.0.0
 */
export default class Bump {
  /**
   * Bump class constructor.
   *
   * @param {Object} options Configuration options.
   * @since 2.0.0
   */
  constructor (options = {}) {
    const { paths, prefix, quiet } = options
    const defaults = {
      paths: {
        changelog: 'CHANGELOG.md',
        package: 'package.json',
      },
      prefix: '',
      quiet: false,
    }
    const passed = {
      paths: paths && getType(paths) === 'object' ? paths : {},
    }
    this.prefix = prefix === true ? 'v' : defaults.prefix
    this.quiet = getType(quiet) === 'boolean' ? quiet : defaults.quiet
    this.paths = {
      ...defaults.paths,
      ...passed.paths,
    }
    console.log(this.paths)
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
    } catch (p) {
      console.error(chalk.red(p.stderr))
      $`exit 1`
    }
  }

  /**
   * Handle async setup tasks.
   *
   * @since 2.2.0
   */
  async setup () {
    try {
      const pkg = await readFile(this.paths.package, 'utf8')
      const { repository, version } = JSON.parse(pkg.toString())

      if (!version) throw new Error('Missing package.json version')

      this.repository = repository?.url ||
        (await $`git remote get-url --push origin`).toString()
          .replace('\n', '')
      this.repository = 'https://' + this.repository
        .replace(/^git[+@]?/, '')
        .replace(/^(https?|ssh)?:\/\//, '')
        .replace(/\.git(#.*$)?/, '')
        .replace(':', '/')

      // Initialize Git.
      this.git = new Git({
        quiet: this.quiet,
        repository: this.repository,
        version,
      })
      await this.git.init()

      // Initialize Changelog.
      this.changelog = new Changelog({
        path: this.paths.changelog,
        prefix: this.prefix,
        quiet: this.quiet,
        remote: this.git.remote,
        repository: this.repository,
        version,
      })

      // Initialize WordPress.
      this.wordpress = new WordPress({ quiet: this.quiet, version })
    } catch (p) {
      console.error(chalk.red(p.stderr))
      $`exit 1`
    }
  }

  /**
   * Bump.
   *
   * @since 2.0.0
   */
  async bump () {
    try {
      // Bump Changelog.
      await this.changelog.init()

      // Bump WordPress.
      await this.wordpress.init()
    } catch (p) {
      console.error(chalk.red(p.stderr))
      $`exit 1`
    }
  }

  /**
   * Log the class instance to the console.
   */
  debug () {
    console.log(this)
  }
}
