import { FileSystem } from './FileSystem'
import yargs from 'yargs/yargs'

export interface DecisionMaker {
	getOptions: () => Promise<Decisions>
}

export interface Decisions {
	[key: string]: any
}

export class CliEntrypoint implements DecisionMaker {
	#aliases: [string, string][] = [
		['c', 'config'],
		['p', 'prefix'],
		['q', 'quiet'],
	]
	#argv: Decisions
	#defaults?: Decisions
	#fileSystem: FileSystem
	#options?: Decisions

	constructor(fileSystem: FileSystem) {
		this.#fileSystem = fileSystem

		const parsed = yargs(process.argv.slice(2))
			.scriptName('release-bump')
			.usage('$0 [args]')
			.help()
			.version()

		this.#aliases.forEach((alias) => parsed.alias(...alias))

		this.#argv = parsed.argv
	}

	/**
	 * Sets defaults.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 */
	async #setDefaults(): Promise<void> {
		const { version } =
			JSON.parse(await this.#fileSystem.getFile('package.json'))

		this.#defaults = {
			version,
		}
	}

	/**
	 * Sets options.
	 *
	 * @since  unreleased
	 * @return {Promise<void>}
	 */
	async #setOptions(): Promise<void> {
		if (typeof this.#defaults === 'undefined')
			await this.#setDefaults()

		const { _, $0, ...options } = this.#argv

		this.#options = {
			...this.#defaults,
			...options,
		}
	}

	/**
	 * Gets options.
	 *
	 * @since  unreleased
	 * @return {Promise<Decisions>} Options.
	 */
	async getOptions(): Promise<Decisions> {
		if (typeof this.#options === 'undefined')
			await this.#setOptions()

		return this.#options ?? {}
	}
}
