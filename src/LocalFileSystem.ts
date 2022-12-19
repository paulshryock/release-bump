import { FileSystem, FileSystemError } from './FileSystem'
import { readdir, readFile, stat } from 'node:fs/promises'

class LocalFileSystemError extends FileSystemError {}

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
   * Gets file contents.
   *
   * @since  unreleased
   * @param  {string}          file File to read.
   * @return {Promise<string>}      File contents.
   * @throws {LocalFileSystemError}
   */
  async getFile(file: string): Promise<string> {
  	try {
  		return await readFile(file, 'utf8')
  	} catch (error: any) {
  		throw new LocalFileSystemError('could not read file', error)
  	}
  }

  /**
   * Gets file paths of non-empty existing files.
   *
   * @since  unreleased
   * @return {Promise<string[]>} File paths.
   * @todo   Join relative path and get absolute path.
   */
  async getFilePaths(): Promise<string[]> {
  	if (this.#filePaths.length < 1)
    	await this.#setFilePaths(this.#path)

    await this.#validateFilePaths()

    return this.#filePaths
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
	  	if ((await stat(path)).isFile())
	  		this.#filePaths.push(path)
	  	else {
	  		await this.#setDirectoryFilePaths((await readdir(path))
	  			.map((fileOrDirectory) => {
	  				if (path === '.')
	  					return fileOrDirectory
	  				return `${path}/${fileOrDirectory}`
	  			}))
	  	}
  	} catch (error: any) {
  		if (error.code !== 'ENOENT')
  			throw error
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
	  	directoryContents.map(async (path) => await this.#setFilePaths(path)))
  }

  /**
   * Validates file paths.
   *
   * @since  unreleased
   * @return Promise<void>
   * @throws FileSystemError
   */
  async #validateFilePaths(): Promise<void> {
    let validFilePaths: string[] = []
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
  		const fileContents = await readFile(filePath, 'utf8')
  		return fileContents !== ''
  	} catch (error) {
  		return false
  	}
  }
}
