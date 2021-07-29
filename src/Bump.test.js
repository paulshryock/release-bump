import test from 'ava'
import Bump from './Bump.js'
import { getType } from './utils/type.js'

const defaults = {
  paths: {
    changelog: 'CHANGELOG.md',
    package: 'package.json',
  },
  prefix: '',
  quiet: false,
}

const emptyOptions = {}

const badOptions = {
  paths: 1,
  prefix: 2,
  quiet: 3,
}

const temp = {
  dir: 'temp',
}

const options = {
  paths: {
    changelog: `${temp.dir}/${defaults.paths.changelog}`,
    package: `${temp.dir}/${defaults.paths.package}`,
  },
  prefix: true,
}

const expected = {
  prefix: 'v',
}

function hasDefaults (t, bump) {
  t.plan(3)
  t.deepEqual(bump.paths, defaults.paths, 'has the default paths')
  t.is(bump.prefix, defaults.prefix, 'has the default prefix')
  t.is(bump.quiet, defaults.quiet, 'has the default quiet')
}

/**
 * Constructor tests.
 */

test('constructor with no options passed', t => {
  const bump = new Bump()
  hasDefaults(t, bump)
})

test('constructor with empty options object passed', t => {
  const bump = new Bump(emptyOptions)
  hasDefaults(t, bump)
})

test('constructor with bad options passed', t => {
  const bump = new Bump(badOptions)
  hasDefaults(t, bump)
})

test('constructor with options passed', t => {
  t.plan(3)
  const bump = new Bump(options)
  t.deepEqual(bump.paths, options.paths, 'has the correct paths')
  t.is(bump.prefix, expected.prefix, 'has the correct prefix')
  t.deepEqual(bump.paths, options.paths, 'has the correct paths')
})

/**
 * Setup tests.
 */

test('after setup', async t => {
  t.plan(4)
  const bump = new Bump()
  await bump.setup()
  t.is(getType(bump.repository), 'string', 'repository is a string')
  t.is(getType(bump.git), 'object', 'git is an object.')
  t.is(getType(bump.changelog), 'object', 'changelog is an object.')
  t.is(getType(bump.wordpress), 'object', 'wordpress is an object.')
})