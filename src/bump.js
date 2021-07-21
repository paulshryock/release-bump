import { $, chalk } from 'zx'
import Git from './Git.js'
import Changelog from './Changelog.js'
import WordPress from './WordPress.js'

$.verbose = false

export default class Bump {
  constructor () {
    this.prefix = 'v'
  }

  /**
   * Initialize.
   */
  async init () {
    try {
      const pkg = await fs.readFile('./package.json')
      const { version } = JSON.parse(pkg.toString())

      if (!version) throw new Error('Missing package.json version')

      const [month, date, year] = new Date()
        .toLocaleDateString('en-US')
        .split('/')
      const formattedMonth = month < 10 ? `0${month}` : month
      const formattedDate = date < 10 ? `0${date}` : date
      this.today = `${year}/${formattedMonth}/${formattedDate}`

      // Get git info.
      this.git = new Git({ version })
      await this.git.init()

      // Bump Changelog.
      this.changelog = new Changelog({
        prefix: this.prefix,
        remote: this.git.remote,
        repository: this.git.repository,
        today: this.today,
        version: this.git.version,
      })
      await this.changelog.init()

      // Bump WordPress.
      this.wordpress = new WordPress({ version })
      await this.wordpress.init()
    } catch (p) {
      console.error(p.stderr)
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
