import { constants, readFileSync } from 'fs'
import { access } from 'fs/promises'

/**
 * Check if the file exists in the current directory, and if it is readable.
 *
 * @param  {string}  file The file path.
 * @return {boolean}      Whether or not the file exists and is readable.
 * @since  unreleased
 */
async function exists (file) {
  if (!file) {
    throw new Error('fileExists() missing file.')
    return
  }

  let exists
  try {
    await access(file, constants.F_OK | constants.R_OK)
    exists = true
  } catch (error) {
    exists = false
  }

  return exists
}

/**
 * Get file.
 *
 * @param {Object} options      File options.
 * @param {string} options.path File path.
 * @param {string} options.type File type.
 * @since unreleased
 */
export async function get (options = {}) {
  const { path } = options
  if (!path) {
    throw new Error('getFile() missing path.')
    return
  }

  let file = null
  let fileExists = false
  try {
    // If the file doesn't exist, bail.
    fileExists = await exists(path)
    if (!fileExists) return

    // Get the file text.
    file = readFileSync(path, 'utf8')
  } catch (error) {
    return file
  }

  return file
}
