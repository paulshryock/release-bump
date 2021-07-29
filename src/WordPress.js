import { $, chalk } from 'zx'
import { writeFile } from 'fs/promises'
import { parse } from 'path'
import { getFileContent } from './utils/file.js'
import { getType } from './utils/type.js'

$.verbose = false

/**
 * WordPress class.
 *
 * @since 2.0.0
 */
export default class WordPress {
  /**
   * WordPress class constructor.
   *
   * @param {Object} options Configuration options.
   * @since 2.0.0
   */
  constructor (options = {}) {
    try {
      const { paths, quiet, version } = options
      this.paths = {
        plugin: paths?.plugin || parse(process.cwd()).name + '.php',
        theme: paths?.theme || 'style.css',
      }
      this.quiet = process.env.NODE_ENV === 'test'
        ? true
        : (quiet !== undefined
            ? quiet
            : false)
      this.version = getType(version) === 'string' ? version : null
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

      // If there is no WordPress plugin or theme to bump, bail.
      if (!this.plugin?.text && !this.theme?.text) return

      // Bump.
      await this.bump()
    } catch (p) {
      console.error(p.stderr)
      $`exit 1`
    }
  }

  /**
   * Handle async setup tasks.
   *
   * @since 2.2.0
   */
  async setup () {
    if (!this.paths.plugin || !this.paths.theme || !this.version) {
      throw new Error('Could not bump WordPress.')
    }

    try {
      this.plugin = await {
        path: this.paths.plugin,
        text: await getFileContent(this.paths?.plugin),
      }

      this.theme = await {
        path: this.paths.theme,
        text: await getFileContent(this.paths?.theme),
      }

      if (!this.plugin.text && !this.theme.text) {
        if (!this.quiet) {
          console.log(chalk.yellow('No WordPress plugin or theme to bump.'))
        }
        delete this.plugin
        delete this.theme
      }
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
      const regex = /Version:(\s+)\d*\.?\d*\.?\d*/

      // Bump WordPress theme version.
      if (!this.theme?.text) {
        if (!this.quiet) {
          console.log(chalk.yellow('No WordPress theme to bump.'))
        }
        this.theme = null
      } else {
        if (!this.theme?.text?.match(regex)) {
          if (!this.quiet) {
            console.log(
              chalk.yellow(
                'Can not bump WordPress theme. Missing Version header.',
              ),
            )
          }
          return
        }

        // Bump theme.
        this.theme.new = this.theme.text
          .replace(regex, `Version:$1${this.version}`)
        writeFile(this.theme.path, this.theme.new, 'utf8')
        if (!this.quiet)console.log(chalk.green('Bumped WordPress theme.'))
      }

      // Bump WordPress plugin version.
      if (!this.plugin?.text) {
        if (!this.quiet) {
          console.log(chalk.yellow('No WordPress plugin to bump.'))
        }
        this.plugin = null
      } else {
        if (!this.plugin?.text?.match(regex)) {
          if (!this.quiet) {
            console.log(
              chalk.red('Can not bump WordPress plugin. Missing Version header.'),
            )
          }
          return
        }

        // Bump plugin.
        this.plugin.new = this.plugin.text
          .replace(regex, `Version:$1${this.version}`)
        writeFile(this.plugin.path, this.plugin.new, 'utf8')
        if (!this.quiet)console.log(chalk.green('Bumped WordPress plugin.'))
      }
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }
}
