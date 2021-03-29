const deepmerge = require('deepmerge')
// @todo: Include a deepmerge utility instead of a dependency.
// @see: https://thewebdev.info/2021/03/06/how-to-deep-merge-javascript-objects/
const Changelog = require('./changelog.js')

/**
 * Bump class.
 *
 * @since 1.0.0
 * @type  {Class}
 */
module.exports = class Bump {
  /**
   * Bump class constructor.
   *
   * @param {Object} options Configuration options.
   * @since 1.0.0
   */
  constructor(options = {}) {
    this.options = options

    // Setup Changelog.
    this.changelog()
  }

  /**
   * Setup Changelog.
   *
   * @since 1.0.0
   */
  changelog() {
    const defaults = {
      filePath: './CHANGELOG.md',
      includeV: true,
      initialText: '',
      initialTextUrl: 'https://keepachangelog.com/en/1.0.0/',
      remote: 'github',
    }
    
    new Changelog(
      this.options.changelog
        ? deepmerge(defaults, this.options.changelog)
        : defaults
    )
  }
}
