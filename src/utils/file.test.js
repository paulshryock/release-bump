import test from 'ava'
import { fileExists, getFileContent } from './file.js'
import { mkdir, rm, writeFile } from 'fs/promises'

const emptyPath = ''
const goodPath = 'package.json'
const badPath = goodPath + '1'

const temp = {
  dir: 'temp/file',
}

const path = `${temp.dir}/${goodPath}`

/**
 * Returns false.
 *
 * @param {Object}  t      Assertion object.
 * @param {Boolean} exists Whether or not file exists.
 * @since unreleased
 */
function returnsFalse (t, exists) {
  t.plan(1)
  t.is(exists, false, 'returns false')
}

/**
 * Returns null.
 *
 * @param {Object} t       Assertion object.
 * @param {Object} content File content.
 * @since 2.2.0
 */
function returnsNull (t, content) {
  t.plan(1)
  t.is(content, null, 'returns null')
}

/**
 * fileExists() tests.
 */

test('fileExists with no path', async t => {
  const exists = await fileExists()
  returnsFalse(t, exists)
})

test('fileExists with empty path', async t => {
  const exists = await fileExists(emptyPath)
  returnsFalse(t, exists)
})

test('fileExists with bad path', async t => {
  const exists = await fileExists(badPath)
  returnsFalse(t, exists)
})

test('fileExists with path', async t => {
  const exists = await fileExists(goodPath)
  t.plan(1)
  t.assert(exists, 'returns true')
})

/**
 * getFileContent() tests.
 */

test('getFileContent with no path', async t => {
  const content = await getFileContent()
  returnsNull(t, content)
})

test('getFileContent with empty path', async t => {
  const content = await getFileContent(emptyPath)
  returnsNull(t, content)
})

test('getFileContent with bad path', async t => {
  const content = await getFileContent(badPath)
  returnsNull(t, content)
})

test('getFileContent with path', async t => {
  t.plan(1)

  // Write test file.
  await mkdir(temp.dir, { recursive: true })
  const data = await getFileContent(goodPath)
  await writeFile(path, data)

  const content = await getFileContent(path)
  t.is(
    content,
    data,
    'path to existing file returns the right text string',
  )
})

/**
 * Cleanup
 */

test.after('cleanup', async () => {
  await rm(temp.dir, { recursive: true, force: true })
})
