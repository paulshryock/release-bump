import { constants } from 'fs'
import { access, readFile } from 'fs/promises'

/**
 * Check if the file exists in the current directory, and if it is readable.
 *
 * @param  {string}  path The file path.
 * @return {boolean}      Whether or not the file exists and is readable.
 * @since  2.2.0
 */
export async function fileExists (path = '') {
  if (!path) return false

  let exists = true
  try {
    await access(path, constants.F_OK | constants.R_OK)
  } catch (error) {
    exists = false
  }

  return exists
}

/**
 * Get file content as a string, if it exists.
 *
 * @param  {string} path File path.
 * @return {string}      The file content, or an empty string.
 * @since  2.2.0
 */
export async function getFileContent (path = '') {
  // If there is no path, bail.
  if (!path) return null

  // If the file doesn't exist, bail.
  const exists = await fileExists(path)
  if (!exists) return null

  // Get the file text.
  return await readFile(path, 'utf8')
}
