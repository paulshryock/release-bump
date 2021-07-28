import test from 'ava'
import Git from './Git.js'
import { getType } from './utils/type.js'

const emptyOptions = {}

const badOptions = {
  repository: 1,
  version: 2,
}

const expected = {
  remote: 'github',
}

const options = {
  repository: `https://${expected.remote}.com/example/example`,
  version: '1.0.0',
}

function hasNothing (t, git) {
  t.plan(2)
  t.falsy(git.repository, 'has no repository')
  t.falsy(git.version, 'has no version')
}

/**
 * Constructor tests.
 */

test('constructor with no options passed', t => {
  const git = new Git()
  hasNothing(t, git)
})

test('constructor with empty options passed', t => {
  const git = new Git(emptyOptions)
  hasNothing(t, git)
})

test('constructor with bad options passed', t => {
  const git = new Git(badOptions)
  hasNothing(t, git)
})

test('constructor with options passed', t => {
  t.plan(1)
  const git = new Git(options)
  t.deepEqual({ ...git }, options, 'has the correct options')
})

/**
 * Setup tests.
 */

test('after setup', async t => {
  t.plan(6)

  // Setup Git.
  const git = new Git(options)
  await git.setup()

  t.is(getType(git.branch), 'string', 'branch is string')
  t.is(git.remote, expected.remote, 'has the correct remote')
  t.is(getType(git.commit), 'string', 'commit is string')
  t.is(getType(git.tags), 'object', 'tags is object')
  t.is(getType(git.tags.all), 'array', 'all tags is array')
  t.is(getType(git.tags.current), 'array', 'current tags is array')
})
