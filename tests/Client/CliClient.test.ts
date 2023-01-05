import { CliClient } from '../../src/Client/CliClient'
import { CliConfigurator } from '../../src/Configurator/CliConfigurator'
import { LocalFileSystem } from '../../src/FileSystem/LocalFileSystem'
import { ConsoleLogger } from '../../src/Logger/ConsoleLogger'
import { describe, expect, it } from '@jest/globals'

describe('CliClient', () => {
	it('does something', () => {
		const fs = new LocalFileSystem('src', [])
		const c = new CliConfigurator(fs)
		const l = new ConsoleLogger()

		const cli = new CliClient()
			.setConfigurator(c)
			.setFileSystem(fs)
			.setLogger(l)

		expect(cli instanceof CliClient).not.toBe(false)
	})
})
