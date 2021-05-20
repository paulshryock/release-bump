const Changelog = require('./changelog.js')
const WordPress = require('./wordpress.js')
const defaults = require('./defaults.js')
const pkg = require('../package.json')
const fs = require('fs')
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
      '--help': Boolean,
      '-h': '--help',

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

      '--version': Boolean,
      '-v': '--version',

      '--skip-wordpress': Boolean,
      '-w': '--skip-wordpress',
    })

    // Get CLI arg values.
    this.argv = { changelog: {} }
    if (this.args['--help']) this.argv.help = this.args['--help']
    if (this.args['--changelog-file-path']) this.argv.changelog.filePath = this.args['--changelog-file-path']
    if (this.args['--git-remote']) this.argv.changelog.gitRemote = this.args['--git-remote']
    if (this.args['--skip-v-in-version']) this.argv.changelog.skipV = this.args['--skip-v-in-version']
    if (this.args['--initial-changelog-text']) this.argv.changelog.initialText = this.args['--initial-changelog-text']
    if (this.args['--initial-changelog-text-url']) this.argv.changelog.initialTextUrl = this.args['--initial-changelog-text-url']
    if (this.args['--skip-wordpress']) this.argv.skipWordPress = this.args['--skip-wordpress']
    if (this.args['--version']) this.argv.version = this.args['--version']

    // Setup defaults.
    this.defaults = defaults

    // Merge passed config object with defaults.
    this.config = deepmerge(this.defaults, config)

    // Merge CLI args with config.
    this.options = deepmerge(this.config, this.argv)

    // Log help information.
    if (this.options.help) return this.help()

    // Log package version.
    if (this.options.version) return this.logPackageVersion()

    // @todo: Get version once and pass it to Changelog and WordPress.

    // Handle Changelog bump.
    new Changelog(this.options.changelog)

    // Handle WordPress bump.
    new WordPress({ skipWordPress: this.options.skipWordPress })
  }

  /**
   * Log help information.
   *
   * @since unreleased
   */
  help () {
    const path = './node_modules/release-bump/README.md'
    this.readme = fs.readFileSync(path, 'utf-8')
      // Get CLI documentation.
      .match(/### CLI.*### JavaScript API/s)[0]
      // Filter configuration details.
      .replace(/### CLI.*#### Configuration\n\n/s, '')
      // Remove last line.
      .replace(/\n\n### JavaScript API/s, '')
    console.info(this.readme)
  }

  /**
   * Log package version.
   *
   * @since unreleased
   */
  logPackageVersion () {
    if (pkg.version) {
      console.info(pkg.version)
    } else {
      console.warn('No version found.')
    }
  }
}
