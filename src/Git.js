import { $, chalk } from 'zx'
import { getType } from './utils/type.js'

$.verbose = false

export default class Git {
  constructor (options = {}) {
    const { repository, version } = options
    this.repository = getType(repository) === 'string' ? repository : null
    this.version = getType(version) === 'string' ? version : null
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
    } catch (error) {
      console.error(chalk.red(error))
      throw error
    }
  }

  /**
   * Handle async setup tasks.
   *
   * @since 2.2.0
   */
  async setup () {
    if (!this.repository || !this.version) {
      throw new Error('Could not read git info.')
    }

    try {
      this.branch = (await $`git branch --show-current`).toString()
        .replace('\n', '')
      this.remote = this.repository
        .replace(/(https?:\/\/|www\.)/g, '')
        .split('/')[0]
        .split('.')[0]
      this.commit = (await $`git log -n 1 --pretty=format:"%H"`).toString()
      this.tags = {
        all: (await $`git tag`).toString().split('\n')
          .filter(tag => tag !== ''),
      }
      this.tags.current = this.tags.all
        .filter(tag => tag.includes(this.version))
    } catch (error) {
      console.error(chalk.red(error))
      throw error
    }
  }
}
