import test from 'ava'
import { getFileContent } from './file.js'
import { mkdir, rm, writeFile } from 'fs/promises'

const defaults = {
  path: 'test.txt',
  text: 'test',
}

const temp = {
  dir: 'temp/file',
}

const emptyOptions = {}

const badOptions = {
  path: 1,
}

const options = {
  path: `${temp.dir}/${defaults.path}`,
}

function hasNull (t, content) {
  t.plan(1)
  t.is(content, null, 'returns null')
}

/**
 * Write test file.
 *
 * @since 2.2.0
 */
async function writeTestFile () {
  await mkdir(temp.dir, { recursive: true })
  await writeFile(options.path, defaults.text)
}

test('getFileContent with no options passed', async t => {
  // Write test file.
  await writeTestFile()

  const content = await getFileContent()
  hasNull(t, content)
})

test('getFileContent with empty options passed', async t => {
  // Write test file.
  await writeTestFile()

  const content = await getFileContent(emptyOptions)
  hasNull(t, content)
})

test('getFileContent with bad options passed', async t => {
  // Write test file.
  await writeTestFile()

  const content = await getFileContent(badOptions)
  hasNull(t, content)
})

test.serial(
  'getFileContent with options passed if file does not exist',
  async t => {
    // Remove test file.
    await rm(options.path, { recursive: true, force: true })

    const content = await getFileContent(options)
    hasNull(t, content)
  },
)

test.serial('getFileContent with options passed if file does exist', async t => {
  t.plan(1)

  // Write test file.
  await writeTestFile()

  const content = await getFileContent(options)
  t.is(
    content,
    defaults.text,
    'path to existing file returns the right text string',
  )
})

/**
 * Cleanup
 */

test.after('cleanup', async () => {
  await rm(temp.dir, { recursive: true, force: true })
})
