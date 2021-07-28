import { constants, readFileSync } from 'fs'
import { access } from 'fs/promises'

/**
 * Check if the file exists in the current directory, and if it is readable.
 *
 * @param  {string}  file The file path.
 * @return {boolean}      Whether or not the file exists and is readable.
 * @since  unreleased
 */
async function fileExists (file) {
  if (!file) return false

  let exists = true
  try {
    await access(file, constants.F_OK | constants.R_OK)
  } catch (error) {
    exists = false
  }

  return exists
}

/**
 * Get file content as a string, if it exists.
 *
 * @param  {Object} options      File options.
 * @param  {string} options.path File path.
 * @return {string}              The file content, or an empty string.
 * @since  unreleased
 * @todo   Change options argument to path string.
 */
export async function getFileContent (options = {}) {
  const { path } = options
  if (!path) {
    return null
  }

  let file = null
  let exists = false
  try {
    // If the file doesn't exist, bail.
    exists = await fileExists(path)
    if (!exists) return null

    // Get the file text.
    file = readFileSync(path, 'utf8')
  } catch (error) {
    return file
  }

  return file
}
