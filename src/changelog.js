const fs = require('fs')
// @todo: Use fetch instead of a dependency.
const axios = require('axios')

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
   * @param {boolean} options.includeV       Whether to include v in the version.
   * @param {string}  options.initialText    The initial Changelog text.
   * @param {string}  options.initialTextUrl The initial Changelog text URL.
   * @param {string}  options.remote         Accepts 'github' or 'bitbucket'.
   * @since 1.0.0
   */
  constructor({ filePath, includeV, initialText, initialTextUrl, remote }) {
    const { version, repository } = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    if (!version || !repository || !repository.url) {
      console.error('version or repository url is missing from package.json.')
      return
    }
    const [month, date, year] = new Date().toLocaleDateString('en-US').split('/')
    this.version = version
    this.repository = repository.url
      .replace(`^git\+?`, '')
      .replace(/^(ssh)?:\/\//, 'https://')
      .replace(/\.git(#.*$)?/, '')
    this.today = `${month}/${date}/${year}`
    this.filePath = filePath
    this.includeV = includeV
    this.initialText = initialText
    this.initialTextUrl = initialTextUrl
    this.remote = remote.toLowerCase()
    this.unreleased =
      `## [Unreleased](${this.repository}/${this.remote === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${this.version})` +
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
      // Set the initialText.
      await this.setInitialText()

      // Set the text.
      this.setText()

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
    if (!this.initialText) {
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
        if (!this.unreleased) return

        this.initialText = this.unreleased
      }
    }
  }

  /**
   * Set text.
   *
   * @since 1.0.0
   */
  setText () {
    try {
      this.text = fs.readFileSync(this.filePath, 'utf8')
    }

    catch (error) {
      switch (error.code) {
        case 'ENOENT': // File does not exist.
          const initialText = this.initialText ? this.initialText : ''
          this.write(initialText)
          throw `${error.path} does not exist.`
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
      `${this.remote === 'bitbucket' ? 'commits/tag' : 'releases/tags'}/` +
      `${this.includeV ? 'v' : ''}${this.version}) - ${this.today}`

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
    console.info('Bumping Changelog to:', this.version)
  }
}
