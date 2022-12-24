/** @since unreleased */
export interface Configuration {
	dryRun: boolean
	prefix: boolean
	quiet: boolean
	release: string
	verbose: boolean
	write: boolean
}

/**
 * @since unreleased
 * @type {Configuration}
 */
export const DEFAULT_CONFIGURATION: Configuration = {
	dryRun: true,
	prefix: true,
	quiet: false,
	release: '',
	verbose: false,
	write: false,
}

/** @since unreleased */
export interface Configurator {
	/**
	 * Gets configuration.
	 *
	 * @since  unreleased
	 * @return {Promise<Configuration>}
	 */
	getConfiguration: () => Promise<Configuration>
}
