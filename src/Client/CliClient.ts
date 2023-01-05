import { Client } from '../Client'
import { CliConfigurator } from '../Configurator/CliConfigurator'
import { LocalFileSystem } from '../FileSystem/LocalFileSystem'
import { ConsoleLogger } from '../Logger/ConsoleLogger'

export class CliClient implements Client {
	configurator?: CliConfigurator
	fileSystem?: LocalFileSystem
	logger?: ConsoleLogger

	setConfigurator(configurator: CliConfigurator): CliClient {
		this.configurator = configurator

		return this
	}

	setFileSystem(fileSystem: LocalFileSystem): CliClient {
		this.fileSystem = fileSystem

		return this
	}

	setLogger(logger: ConsoleLogger): CliClient {
		this.logger = logger

		return this
	}

	/**
	 * Bumps one file. Do we need this?
	 *
	 * @since  unreleased
	 * @param  {string}        path [description]
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpOne(path: string): Promise<void> {
		this.logger?.debug(path)
		return Promise.resolve()
	}

	/**
	 * Bumps many files. Do we need this?
	 *
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpMany(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * Creates an empty changelog.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async createChangelog(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * Bumps the changelog.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpChangelog(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * Bumps the WordPress theme version.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpWordPressTheme(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * Bumps the WordPress plugin version.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpWordPressPlugin(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * Bumps any unreleased `@since` tags in docblock comments.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 * @todo   Implement.
	 */
	async bumpDocblocks(): Promise<void> {
		return Promise.resolve()
	}
}
