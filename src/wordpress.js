const axios = require('axios')
const { readFile, writeFile } = require('fs/promises')

/**
 * WordPress class.
 *
 * @since 1.0.0
 * @type  {Class}
 */
module.exports = class WordPress {
  /**
   * WordPress class constructor.
   *
   * @param {boolean} skipWordPress Whether to skip WordPress theme bump.
   * @since unreleased
   */
  constructor({ skipWordPress }) {
    // Bail early.
    if (skipWordPress) return

    this.filePath = './style.css'

    // Bump WordPress theme version.
    this.bump()
  }

  /**
   * Bump WordPress theme version.
   *
   * @since unreleased
   */
  async bump () {
    try {
      // If there is no text version, bail.
      const text = await readFile(this.filePath, 'utf8')
      const versionRegex = /Version: \d*\.?\d*\.?\d*/
      if (!text.match(versionRegex)) {
        console.error(`${this.filePath} does not contain a version. Can not bump WordPress theme.`)
        return
      }

      // If there is no package version, bail.
      const pkg = await readFile('./package.json', 'utf8')
      const { version } = JSON.parse(pkg)
      if (!version) {
        console.error(
          `Missing package.json version. Can not bump.`
        )
        return
      }

      // Bump WordPress theme version.
      this.version = version
      this.text = text.replace(versionRegex, `Version: ${this.version}`)

      // Write WordPress theme version.
      this.write()
    }

    catch (error) {
      switch (error.code) {
        case 'ENOENT': // File does not exist.
          console.error(`${error.path} does not exist. Can not bump WordPress theme.`)
          break
        default:
          throw error
          break
      }
    }
  }

  /**
   * Write WordPress theme version.
   *
   * @since unreleased
   */
  async write () {
    try {
      console.info(`Bumping WordPress theme to ${this.version}.`)
      writeFile(this.filePath, this.text, 'utf8')
    }

    catch (error) {
      console.error(error)
    }
  }
}
