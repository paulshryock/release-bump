import { NonEmptyString } from './types.js'
import { constants } from 'fs'
import { access, readFile } from 'fs/promises'

/**
 * Check if the file exists in the current directory, and if it is readable.
 *
 * @param  {NonEmptyString} path The file path.
 * @return {boolean}             Whether or not the file exists and is readable.
 * @since  3.0.0
 */
export async function fileExists(path: NonEmptyString): Promise<boolean> {
	try {
		await access(path, constants.F_OK | constants.R_OK)
	} catch (error) {
		return false
	}

	return true
}

/**
 * Get file content as a string, if it exists.
 *
 * @param  {NonEmptyString} path File path.
 * @return {string}              The file content or an empty string.
 * @since  3.0.0
 */
export async function getFileContent(path: NonEmptyString): Promise<string> {
	// If the file doesn't exist, bail.
	const exists = await fileExists(path)
	if (!exists) {
		throw new Error(`${path} does not exist`)
	}

	// Get the file text.
	return await readFile(path, 'utf8')
}
