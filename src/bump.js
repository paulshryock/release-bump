const Changelog = require('./changelog.js')
const defaults = require('./defaults.js')
const arg = require('arg')
const deepmerge = require('deepmerge')
// @todo: Use a deepmerge utility instead of a dependency.
// @see: https://thewebdev.info/2021/03/06/how-to-deep-merge-javascript-objects/

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
   * @param {Object} config Configuration options.
   * @since 1.0.0
   */
  constructor(config = {}) {
    // Define CLI args.
    this.args = arg({
      '--changelog-file-path': String,
      '-p': '--changelog-file-path',

      '--git-remote': String,
      '-r': '--git-remote',

      '--skip-v-in-version': Boolean,
      '--skip-v': '--skip-v-in-version',
      '-s': '--skip-v-in-version',

      '--initial-changelog-text': String,
      '-t': '--initial-changelog-text',

      '--initial-changelog-text-url': String,
      '-u': '--initial-changelog-text-url',
    })

    // Get CLI arg values.
    this.argv = { changelog: {} }
    if (this.args['--changelog-file-path']) this.argv.changelog.filePath = this.args['--changelog-file-path']
    if (this.args['--skip-v-in-version']) this.argv.changelog.skipV = this.args['--skip-v-in-version']
    if (this.args['--initial-changelog-text']) this.argv.changelog.initialText = this.args['--initial-changelog-text']
    if (this.args['--initial-changelog-text-url']) this.argv.changelog.initialTextUrl = this.args['--initial-changelog-text-url']
    if (this.args['--git-remote']) this.argv.changelog.gitRemote = this.args['--git-remote']

    // Setup defaults.
    this.defaults = defaults

    // Merge passed config object with defaults.
    this.config = deepmerge(this.defaults, config)

    // Merge CLI args with config.
    this.options = deepmerge(this.config, this.argv)

    // Setup Changelog.
    new Changelog(this.options.changelog)
  }
}
