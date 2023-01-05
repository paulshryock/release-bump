import { FileSystem, FileSystemError } from '../Client'
import { isErrnoException } from '../Error'
import {
	readdir,
	readFile as nodeReadFile,
	stat,
	writeFile as nodeWriteFile,
} from 'node:fs/promises'

export class LocalFileSystem implements FileSystem {
	/** @type {string[]} File paths. */
	#filePaths: string[]

	/** @type {string[]} Paths to ignore. */
	#pathsToIgnore: string[]

	/** @type {string} Path to file or directory. */
	#path: string

	/**
	 * FileSystem constructor.
	 *
	 * @since unreleased
	 * @param {string}   path          Path to file or directory.
	 * @param {string[]} pathsToIgnore Paths to ignore.
	 */
	constructor(path: string, pathsToIgnore: string[] = []) {
		this.#filePaths = []
		this.#pathsToIgnore = ['.git', 'node_modules', 'vendor', ...pathsToIgnore]
		this.#path = path
	}

	/**
	 * Lists file paths of non-empty files recursively.
	 *
	 * @since  unreleased
	 * @return {Promise<string[]>} File paths.
	 * @todo   Join relative path and get absolute path.
	 */
	async listFiles(): Promise<string[]> {
		if (this.#filePaths.length < 1) await this.#setFilePaths(this.#path)

		await this.#validateFilePaths()

		return this.#filePaths
	}

	/**
	 * Reads a file.
	 *
	 * @since  unreleased
	 * @param  {string}          file File to read.
	 * @return {Promise<string>}      File contents.
	 * @throws {FileSystemError}
	 */
	async readFile(file: string): Promise<string> {
		try {
			return await nodeReadFile(file, 'utf8')
		} catch (error) {
			throw new FileSystemError('could not read file', {
				...(isErrnoException(error) ? { cause: error } : {}),
			})
		}
	}

	/**
	 * Writes a file.
	 *
	 * @since  unreleased
	 * @param  {string}        path Path to file.
	 * @param  {string}        data File data.
	 * @return {Promise<void>}
	 */
	async writeFile(path: string, data: string): Promise<void> {
		await nodeWriteFile(path, data, 'utf8')
	}

	/**
	 * Sets file paths.
	 *
	 * @since  unreleased
	 * @param  {string}        path Path.
	 * @return {Promise<void>}
	 */
	async #setFilePaths(path: string): Promise<void> {
		if (this.#pathsToIgnore.some((pathToIgnore) => path.includes(pathToIgnore)))
			return

		try {
			if ((await stat(path)).isFile()) this.#filePaths.push(path)
			else {
				await this.#setDirectoryFilePaths(
					(
						await readdir(path)
					).map((fileOrDirectory) => {
						if (path === '.') return fileOrDirectory

						return `${path}/${fileOrDirectory}`
					}),
				)
			}
		} catch (error) {
			if (isErrnoException(error) && error.code !== 'ENOENT') throw error
		}
	}

	/**
	 * Sets directory file paths.
	 *
	 * @since  unreleased
	 * @param  {string[]}      directoryContents Directory contents.
	 * @return {Promise<void>}
	 */
	async #setDirectoryFilePaths(directoryContents: string[]): Promise<void> {
		await Promise.all(
			directoryContents.map(async (path) => await this.#setFilePaths(path)),
		)
	}

	/**
	 * Validates file paths.
	 *
	 * @since  unreleased
	 * @return Promise<void>
	 * @throws FileSystemError
	 */
	async #validateFilePaths(): Promise<void> {
		const validFilePaths: string[] = []
		for (const filePath of this.#filePaths) {
			if (await this.#fileExistsAndIsNotEmpty(filePath))
				validFilePaths.push(filePath)
		}

		this.#filePaths = validFilePaths
	}

	/**
	 * Determines if file exists and is not empty.
	 *
	 * @since  unreleased
	 * @param  {string}           filePath File path.
	 * @return {Promise<boolean>}          Whether file exists and is not empty.
	 */
	async #fileExistsAndIsNotEmpty(filePath: string): Promise<boolean> {
		try {
			const fileContents = await this.readFile(filePath)
			return fileContents !== ''
		} catch (error) {
			return false
		}
	}
}
