import {
	defaultConfiguration,
} from '../../src/Configurator/DefaultConfigurator'
import { CliConfigurator } from '../../src/Configurator/CliConfigurator'
import { Configuration } from '../../src/Configurator/Configurator'
import { FileSystem } from '../../src/FileSystem/FileSystem'
import { describe } from '@jest/globals'

function getBeforeAfter(before: any, after: any): string {
	return `${JSON.stringify(before)}: ${JSON.stringify(after)}`
}

class MockFileSystem implements FileSystem {
	#path: string
	#pathsToIgnore: string[]

	constructor(path: string, pathsToIgnore: string[]) {
		this.#path = path
		this.#pathsToIgnore = pathsToIgnore
	}

  async getFile (file: string): Promise<string> {
  	return JSON.stringify({
  		file,
  		version: '1.0.0',
  	})
  }

  async getFilePaths(): Promise<string[]> {
  	return [this.#path, this.#pathsToIgnore.join('')]
  }
}

describe('CliConfigurator', () => {

  let originalArgv: string[]
  const nodeBinaryPath = '/path/to/node/binary'
  const cliBinaryPath = '/path/to/cli/binary'
  const binaryPaths = [nodeBinaryPath, cliBinaryPath]

	beforeEach(() => {
	  originalArgv = process.argv
	})

	afterEach(() => {
	  process.argv = originalArgv
	})

	describe.each([
		[[], { ...defaultConfiguration, release: '1.0.0' }],
		[['hello'], { ...defaultConfiguration, release: '1.0.0' }],
		[
			['--something', 'comma,separated,value'],
			{
				...defaultConfiguration,
				something: 'comma,separated,value',
				release: '1.0.0',
			},
		],
		[
			['--hello-world', 'value'],
			{ ...defaultConfiguration, helloWorld: 'value', release: '1.0.0' },
		],
		[
			['-pq'],
			{ ...defaultConfiguration, prefix: true, quiet: true, release: '1.0.0' },
		],
	])('getOptions', (argv: string[], expected: Configuration) => {

		beforeEach(() => {
			process.argv = [...binaryPaths, ...argv]
		})

		describe('gets options', () => {
			it(getBeforeAfter(argv, expected), async () => {
				const fileSystem = new MockFileSystem('src', [])
				const cliConfigurator = new CliConfigurator(fileSystem)
				const received = await cliConfigurator.getOptions()

				expect(received).toStrictEqual(expect.objectContaining(expected))
			})
		})
	})
})
