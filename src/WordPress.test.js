import test from 'ava'
import WordPress from './WordPress.js'
import { getFileContent } from './utils/file.js'
import { getType } from './utils/type.js'
import { mkdir, rm, writeFile } from 'fs/promises'

const temp = {
  dir: 'temp/wordpress',
}

const defaults = {
  text: '/**' + '\n' +
    ' * Version:     0.0.0' + '\n' +
    ' */',
}

const emptyOptions = {}

const badOptions = {
  paths: 1,
  quiet: 2,
  version: 3,
}

const options = {
  paths: {
    plugin: `${temp.dir}/plugin.php`,
    theme: `${temp.dir}/style.css`,
  },
  quiet: true,
  version: '1.0.0',
}

const expected = {
  ...options,
  plugin: {
    path: options.paths.plugin,
    text: defaults.text,
  },
  theme: {
    path: options.paths.theme,
    text: defaults.text,
  },
}

/**
 * Has nothing.
 *
 * @param {Object}    t         Test assertion object.
 * @param {WordPress} wordpress WordPress instance.
 * @since 2.2.0
 */
function hasNothing (t, wordpress) {
  t.plan(4)
  t.assert(wordpress.paths.plugin, 'has a plugin path')
  t.assert(wordpress.paths.theme, 'has a theme path')
  t.assert(wordpress.quiet, 'has quiet set to true')
  t.falsy(wordpress.version, 'has no version')
}

/**
 * Has missing file options.
 *
 * @param {Object}    t         Test assertion object.
 * @param {WordPress} wordpress WordPress instance.
 * @since 2.2.0
 */
function hasMissingFileOptions (t, wordpress) {
  t.plan(1)
  t.deepEqual({ ...wordpress }, options, 'has the right options')
}

/**
 * Constructor tests.
 */

test('constructor with no options passed', t => {
  const wordpress = new WordPress()
  hasNothing(t, wordpress)
})

test('constructor with empty options passed', t => {
  const wordpress = new WordPress(emptyOptions)
  hasNothing(t, wordpress)
})

test('constructor with bad options passed', t => {
  const wordpress = new WordPress(badOptions)
  hasNothing(t, wordpress)
})

test('constructor with options passed', t => {
  const wordpress = new WordPress(options)
  hasMissingFileOptions(t, wordpress)
})

/**
 * Setup tests.
 */

test.serial('after setup if files do not exist', async t => {
  // Remove plugin and theme files.
  for (const type in options.paths) {
    await rm(options.paths[type], { recursive: true, force: true })
  }

  // Setup WordPress.
  const wordpress = await new WordPress(options)
  await wordpress.setup()
  hasMissingFileOptions(t, wordpress)
})

test.serial('after setup if files do exist', async t => {
  t.plan(1)
  // Write plugin and theme files.
  await mkdir(temp.dir, { recursive: true })
  for (const type in options.paths) {
    await writeFile(
      options.paths[type],
      defaults.text,
    )
  }

  // Setup WordPress.
  const wordpress = await new WordPress(options)
  await wordpress.setup()
  t.deepEqual({ ...wordpress }, expected, 'has the right options')
})

/**
 * Bump tests.
 */

test('after bump', async t => {
  // Write plugin and theme files.
  await mkdir(temp.dir, { recursive: true })
  for (const type in options.paths) {
    await writeFile(
      options.paths[type],
      defaults.text,
    )
  }

  // Bump WordPress.
  const wordpress = new WordPress(options)
  await wordpress.setup()
  await wordpress.bump()

  // Test written files.
  for (const type in options.paths) {
    const file = await getFileContent(options.paths[type])
    await Promise.all([
      t.assert(file, 'file exists'),
      t.is(getType(file), 'string', 'file contents is a string'),
      t.assert(file.includes(options.version), 'file has new version'),
    ])
  }
})

/**
 * Cleanup
 */

test.after('cleanup', async () => {
  await rm(temp.dir, { recursive: true, force: true })
})
