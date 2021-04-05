const axios = require('axios')
const fs = require('fs')

/**
 * Changelog class.
 *
 * @since 1.0.0
 * @type  {Class}
 */
module.exports = class Changelog {
  /**
   * Changelog class constructor.
   *
   * @param {string}  options.filePath       The Changelog file path.
   * @param {string}  options.gitRemote      The Git remote. (`github`|`bitbucket`)
   * @param {string}  options.initialText    The initial Changelog text.
   * @param {string}  options.initialTextUrl The initial Changelog text URL.
   * @param {boolean} options.skipV          Whether to skip v in the version.
   * @since 1.0.0
   */
  constructor({ filePath, gitRemote, initialText, initialTextUrl, skipV }) {
    const { version, repository } = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    if (!version) {
      console.error('version is missing from package.json.')
      return
    }
    if (!repository || !repository.url) {
      console.error('repository url is missing from package.json.')
      return
    }
    const [month, date, year] = new Date().toLocaleDateString('en-US').split('/')
    this.version = version
    this.repository = repository.url
      .replace(/^git\+?/, '')
      .replace(/^(ssh)?:\/\//, 'https://')
      .replace(/\.git(#.*$)?/, '')
    this.today = `${month}/${date}/${year}`
    this.filePath = filePath
    this.gitRemote = gitRemote.toLowerCase()
    this.initialText = initialText
    this.initialTextUrl = initialTextUrl
    this.skipV = skipV
    this.unreleased =
      '## [Unreleased]' +
      `(${this.repository}/${this.gitRemote === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${this.version})` +
      '\n\n### Added' +
      '\n\n### Changed' +
      '\n\n### Deprecated' +
      '\n\n### Removed' +
      '\n\n### Fixed' +
      '\n\n### Security'

    // Handle asyncronous constructor tasks.
    this.init()
  }

  /**
   * Handle asyncronous constructor tasks.
   *
   * @since 1.0.0
   */
  async init () {
    try {
      // Set the text.
      await this.setText()

      // Bump the Changelog.
      this.bump()
    }

    catch (error) {
      console.error(error)
    }
  }

  /**
   * Set the initialText. If there is none passed, get it from initialTextUrl.
   *
   * @since 1.0.0
   */
  async setInitialText () {
    console.info(`Getting Changelog initial text from ${this.initialTextUrl}.`)
    try {
      const { data } = await axios.get(this.initialTextUrl)
      this.initialText = data
        // Get Changelog intro text.
        .match(/# Changelog.*## \[Unreleased\]/s)[0]
        // Fix newlines.
        .replace(/&#x000A;/g, '\n')
        // Add unreleased lines.
        .replace(/## \[Unreleased\](\(.*\))?/, this.unreleased)
        // Remove link and add a newline.
        .replace(/## \[Unreleased\](\(.*\))?/, '## [Unreleased]') + '\n'
    }

    catch (error) {
      console.warn(`Bad response from ${this.initialTextUrl}.`)
      this.initialText = this.unreleased
        ? this.unreleased
          // Remove link and add a newline.
          .replace(/## \[Unreleased\](\(.*\))?/, '## [Unreleased]') + '\n'
        : ''
    }
  }

  /**
   * Set text.
   *
   * @since 1.0.0
   */
  async setText () {
    try {
      this.text = fs.readFileSync(this.filePath, 'utf8')
    }

    catch (error) {
      switch (error.code) {
        case 'ENOENT': // File does not exist.
          console.error(`${error.path} does not exist.`)
          if (!this.initialText) await this.setInitialText()
          this.write(this.initialText)
          throw 'Cancelling Changelog bump.'
          break
        default:
          throw error
          break
      }
    }
  }

  /**
   * Write Changelog.
   *
   * @param {string} content The Changelog content.
   * @since 1.0.0
   */
  write (content) {
    fs.writeFile(this.filePath, content, 'utf8', (err) => {
      if (err) throw err
      console.info('Writing Changelog to:', this.filePath)
    })
    this.text = content
  }

  /**
   * Bump Changelog.
   * 
   * @since 1.0.0
   */
  bump () {
    this.header = `## [${this.version}](${this.repository}/` +
      `${this.gitRemote === 'bitbucket' ? 'commits/tag' : 'releases/tags'}/` +
      `${this.skipV ? '' : 'v'}${this.version}) - ${this.today}`

    console.info('Bumping Changelog to:', this.version)
    this.write(this.text
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
    )
  }
}
