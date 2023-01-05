import { Configuration, Configurator, DEFAULT_CONFIGURATION } from '../Client'
import { FileSystem } from '../Client'
import process from 'node:process'
import yargs, { Argv } from 'yargs'

export class CliConfigurator implements Configurator {
	#aliases: [string, string][] = [
		['c', 'configPath'],
		['p', 'prefix'],
		['q', 'quiet'],
		['r', 'release'],
	]
	#configuration: Configuration
	#fileSystem: FileSystem

	/**
	 * @since unreleased
	 * @param {FileSystem} fileSystem File system.
	 */
	constructor(fileSystem: FileSystem) {
		this.#fileSystem = fileSystem

		const parsed = yargs(process.argv.slice(2))
			.scriptName('release-bump')
			.usage('$0 [args]')
			.help()
			.version()

		this.#aliases.forEach((alias) => parsed.alias(...alias))

		this.#configuration = {
			...DEFAULT_CONFIGURATION,
			...this.#getValidConfiguration(parsed.argv),
		}
	}

	/**
	 * Gets configuration.
	 *
	 * @since  unreleased
	 * @return {Promise<Configuration>} Configuration.
	 */
	async getConfiguration(): Promise<Configuration> {
		if (this.#configuration.release === '') await this.#setRelease()

		return this.#configuration
	}

	#getValidConfiguration(argv: object): object {
		return Object.entries(argv).reduce(
			(all, [key, value]: [key: string, value: keyof Argv]) => {
				if (!Object.keys(DEFAULT_CONFIGURATION).includes(key)) return all

				return { ...all, [key]: value }
			},
			{},
		)
	}

	async #setRelease(): Promise<void> {
		const { version } = JSON.parse(
			await this.#fileSystem.readFile('package.json'),
		) as { version: string }

		this.#configuration.release = version
	}
}
