import chalk from 'chalk'
import { getType } from './utils/type.js'
import simpleGit from 'simple-git'

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
      const git = simpleGit()
      this.branch = (await git.branch()).current
      this.remote = this.repository
        .replace(/(https?:\/\/|www\.)/g, '')
        .split('/')[0]
        .split('.')[0]
      // todo: Get short format: git log -n 1 --pretty=format:"%H"
      this.commit = (await git.log()).latest.hash
      this.tags = (await git.tags())
    } catch (error) {
      console.error(chalk.red(error))
      throw error
    }
  }
}
