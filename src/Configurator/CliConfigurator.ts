import { defaultConfiguration } from './DefaultConfigurator'
import { Configuration, Configurator } from './Configurator'
import { FileSystem } from '../FileSystem/FileSystem'
import yargs from 'yargs/yargs'

export class CliConfigurator implements Configurator {
	#aliases: [string, string][] = [
		['c', 'config'],
		['p', 'prefix'],
		['q', 'quiet'],
		['r', 'release'],
	]
	#options: Configuration
	#fileSystem: FileSystem

	constructor(fileSystem: FileSystem) {
		this.#fileSystem = fileSystem

		const parsed = yargs(process.argv.slice(2))
			.scriptName('release-bump')
			.usage('$0 [args]')
			.help()
			.version()

		this.#aliases.forEach((alias) => parsed.alias(...alias))

		this.#options = {
			...defaultConfiguration,
			...parsed.argv,
		}
	}

	/**
	 * Gets options.
	 *
	 * @since  unreleased
	 * @return {Promise<Configuration>} Options.
	 */
	async getOptions(): Promise<Configuration> {
		if (this.#options.release === '')
			await this.#setRelease()

		return this.#options
	}

	/**
	 * Sets version.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 */
	async #setRelease(): Promise<void> {
		const { version } =
			JSON.parse(await this.#fileSystem.getFile('package.json'))

		this.#options.release = version
	}
}
