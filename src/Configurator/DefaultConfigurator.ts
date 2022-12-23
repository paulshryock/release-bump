import { Configuration, Configurator } from './Configurator'

export const defaultConfiguration: Configuration = {
	dryRun: true,
	prefix: true,
	quiet: false,
	release: '',
	verbose: false,
	write: false,
}

export class DefaultConfigurator implements Configurator {
	async getOptions(): Promise<Configuration> {
		return defaultConfiguration
	}
}
