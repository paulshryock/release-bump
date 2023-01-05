import { CliConfigurator } from '../../src/Configurator/CliConfigurator'
import {
	Configuration,
	DEFAULT_CONFIGURATION,
} from '../../src/Client'
import { NullFileSystem } from '../../src/FileSystem/NullFileSystem'
import { describe } from '@jest/globals'

describe('CliConfigurator', () => {

  let originalArgv: string[]
  const nodeBinaryPath = '/path/to/node/binary'
  const cliBinaryPath = '/path/to/cli/binary'
  const binaryPaths = [nodeBinaryPath, cliBinaryPath]
  const defaults = DEFAULT_CONFIGURATION

	beforeEach(() => {
	  originalArgv = process.argv
	})

	afterEach(() => {
	  process.argv = originalArgv
	})

	describe.each([
		['no args, flags, or commands', [], defaults],
		['invalid arg', ['--hello-world', 'value'], defaults],
		['invalid flag', ['-z'], defaults],
		['invalid command', ['hello'], defaults],
		['one valid flag', ['-p'], { ...defaults, prefix: true}],
		[
			'two valid flags',
			['-pq'],
			{ ...defaults, prefix: true, quiet: true},
		],
	])('getConfiguration', (testCase: string, argv: string[], expected: Configuration) => {

		beforeEach(() => {
			process.argv = [...binaryPaths, ...argv]
		})

		describe('gets configuration from cli', () => {
			it(`${testCase}`, async () => {
				const fs = new NullFileSystem('src', [])
				const c = new CliConfigurator(fs)

				expect(await c.getConfiguration()).toStrictEqual(expected)
			})
		})
	})
})
