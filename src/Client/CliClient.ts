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

	async bumpOne(path: string): Promise<void> {
		this.logger?.debug(path)
		return
	}
	async bumpMany(): Promise<void> {}

	async createChangelog(): Promise<void> {}
	async bumpChangelog(): Promise<void> {}
	async bumpWordPressTheme(): Promise<void> {}
	async bumpWordPressPlugin(): Promise<void> {}
	async bumpDocblocks(): Promise<void> {}
}
