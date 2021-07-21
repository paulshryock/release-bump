import { $, chalk, fs } from 'zx'

$.verbose = false

export default class Git {
  constructor (options = {}) {
    const { version } = options
    if (!version) {
      console.log(chalk.yellow('Could not read git info.'))
      $`exit 1`
    }
    this.version = version
  }
  /**
   * Initialize.
   */
  async init () {
    try {
      const pkg = await fs.readFile('./package.json')
      const { repository} = JSON.parse(pkg.toString())
      this.branch = (await $`git branch --show-current`).toString()
        .replace('\n', '')
      this.repository = repository?.url
      if (!repository?.url) {
        this.repository = (await $`git remote get-url --push origin`).toString()
          .replace('\n', '')
      }
      this.repository = 'https://' +
        this.repository
          .replace(/^git[+@]?/, '')
          .replace(/^(https?|ssh)?:\/\//, '')
          .replace(/\.git(#.*$)?/, '')
          .replace(':', '/')
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
    } catch (p) {
      console.log(chalk.yellow('Could not read git info'))
      console.error(p.stderr)
      await $`exit 1`
    }
  }
}
