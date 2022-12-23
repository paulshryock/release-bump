export interface Configurator {
	getOptions: () => Promise<Configuration>
}

export interface Configuration {
	dryRun: boolean
	prefix: boolean
	quiet: boolean
	release: string
	verbose: boolean
	write: boolean
}
