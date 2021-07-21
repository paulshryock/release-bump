import { $, chalk, fs } from 'zx'
import { writeFile } from 'fs/promises'
import { parse } from 'path'
import { get } from './utils/file.js'

$.verbose = false

export default class WordPress {
  constructor (options = {}) {
    try {
      const { version } = options
      if (!version) {
        throw new Error('Could not bump WordPress.')
      }

      this.version = version
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }

  async init () {
    try {
      this.theme = {
        path: 'style.css',
        text: await get({ type: 'theme', path: 'style.css' }),
      }
      const plugin = parse(process.cwd()).name + '.php'
      this.plugin = {
        path: plugin,
        text: await get({ type: 'plugin', path: plugin }),
      }

      if (!this.theme?.text && !this.plugin?.text) {
        console.log(chalk.yellow('No WordPress theme or plugin to bump.'))
        this.theme = null
        this.plugin = null
        return
      }

      const regex = /Version:(\s+)\d*\.?\d*\.?\d*/

      if (!this.theme?.text) {
        console.log(chalk.yellow('No WordPress theme to bump.'))
        this.theme = null
      } else {
        // Bump theme.
        if (!this.theme?.text?.match(regex)) {
          console.log(
            chalk.red('Can not bump WordPress theme. Missing Version header.')
          )
          return
        }

        // Bump WordPress theme version.
        this.theme.new = this.theme.text
          .replace(regex, `Version:$1${this.version}`)
        writeFile(this.theme.path, this.theme.new, 'utf8')
        console.log(chalk.green('Bumped WordPress theme.'))
      }

      // Bump WordPress plugin version.
      if (!this.plugin?.text) {
        console.log(chalk.yellow('No WordPress plugin to bump.'))
        this.plugin = null
      } else {
        // Bump plugin.
        if (!this.plugin?.text?.match(regex)) {
          console.log(
            chalk.red('Can not bump WordPress plugin. Missing Version header.')
          )
          return
        }

        // Bump WordPress plugin version.
        this.plugin.new = this.plugin.text
          .replace(regex, `Version:$1${this.version}`)
        writeFile(this.plugin.path, this.plugin.new, 'utf8')
        console.log(chalk.green('Bumped WordPress plugin.'))
      }
    } catch (error) {
      console.error(chalk.red(error))
      $`exit 1`
    }
  }
}
