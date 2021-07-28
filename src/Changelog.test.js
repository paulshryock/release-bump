import test from 'ava'
import Changelog from './Changelog.js'
import { getType } from './utils/type.js'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'

const defaults = {
  path: 'CHANGELOG.md',
}

const temp = {
  dir: 'temp/changelog',
}

const emptyOptions = {}

const badOptions = {
  path: 1,
  prefix: 2,
  quiet: 3,
  remote: 4,
  repository: 5,
  version: 7,
}

const options = {
  path: `${temp.dir}/${defaults.path}`,
  prefix: '',
  quiet: true,
  remote: 'github',
  repository: 'https://github.com/example/example',
  version: '1.0.0',
}

function hasNothing (t, changelog) {
  t.plan(6)
  t.is(changelog.path, defaults.path, 'has the default path')
  t.falsy(changelog.prefix, 'has no prefix')
  t.assert(changelog.quiet, 'quiet is true for testing')
  t.falsy(changelog.remote, 'has no remote')
  t.falsy(changelog.repository, 'has no repository')
  t.falsy(changelog.version, 'has no version')
}

/**
 * Setup Changelog.
 *
 * @since 2.2.0
 */
async function setupChangelog () {
  const changelog = await new Changelog(options)
  await changelog.setup()
  return changelog
}

/**
 * Write Changelog file.
 *
 * @since 2.2.0
 */
async function writeChangelog () {
  await mkdir(temp.dir, { recursive: true })
  const data = await readFile(defaults.path, 'utf8')
  await writeFile(options.path, data)
}

/**
 * Constructor tests.
 */

test('constructor with no options passed', t => {
  const changelog = new Changelog()
  hasNothing(t, changelog)
})

test('constructor with empty options passed', t => {
  const changelog = new Changelog(emptyOptions)
  hasNothing(t, changelog)
})

test('constructor with bad options passed', t => {
  const changelog = new Changelog(badOptions)
  hasNothing(t, changelog)
})

test('constructor with options passed', t => {
  t.plan(8)
  const changelog = new Changelog(options)
  t.deepEqual({ ...changelog }, options, 'options are passed')
  t.is(changelog.path, options.path, 'has the right path')
  t.is(changelog.prefix, options.prefix, 'has the right prefix')
  t.is(changelog.quiet, options.quiet, 'has the right quiet')
  t.is(changelog.remote, options.remote, 'has the right remote')
  t.is(changelog.repository, options.repository, 'has the right repository')
  t.assert(
    changelog.repository.includes(changelog.remote),
    'has the remote in the repository',
  )
  t.is(changelog.version, options.version, 'has the right version')
})

/**
 * Setup tests.
 */

test.serial('after setup if file does not exist', async t => {
  t.plan(2)
  // Remove Changelog.
  await rm(options.path, { recursive: true, force: true })

  // Setup Changelog.
  const changelog = await setupChangelog()

  t.falsy(changelog.text, 'has no text')
  t.falsy(changelog.new, 'has no new')
})

test.serial('after setup if file does exist', async t => {
  t.plan(4)
  // Write Changelog.
  await writeChangelog()

  // Setup Changelog.
  const changelog = await setupChangelog()

  t.assert(changelog.text, 'has text')
  t.is(getType(changelog.text), 'string', 'text is string')
  t.assert(changelog.new, 'has new')
  t.is(getType(changelog.new), 'string', 'new is string')
})

/**
 * Bump tests.
 */

test('after bump', async t => {
  t.plan(3)
  // Write Changelog.
  await writeChangelog()

  // Bump Changelog.
  const changelog = new Changelog(options)
  await changelog.init()

  // Test written file.
  const file = await readFile(options.path, 'utf8')
  await Promise.all([
    t.assert(file, 'file exists'),
    t.is(getType(file), 'string', 'file contents is a string'),
    t.assert(file.includes(`[${options.version}]`), 'file has new version'),
  ])
})

/**
 * Cleanup
 */

test.after('cleanup', async () => {
  await rm(temp.dir, { recursive: true, force: true })
})
