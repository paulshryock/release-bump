import { CliEntrypoint, Decisions } from '../src/CliEntrypoint'
import { LocalFileSystem } from '../src/LocalFileSystem'
import { describe, jest } from '@jest/globals'

jest.mock('../src/LocalFileSystem', () => {
	return {
		LocalFileSystem: jest.fn().mockImplementation(() => {
			return {
				getFile: jest.fn(() =>
					new Promise((res, _) => res(JSON.stringify({ version: '1.0.0' })))),
			}
		})
	}
})

function getBeforeAfter(before: any, after: any): string {
	return `${JSON.stringify(before)}: ${JSON.stringify(after)}`
}

describe('CliEntrypoint', () => {

  let originalArgv: string[]
  const binary = '/path/to/node'
  const path = '/path/to/cli'
  const defaultArgv = [binary, path]

	beforeEach(() => {
	  originalArgv = process.argv
	})

	afterEach(() => {
	  process.argv = originalArgv
	})

	describe.each([
		[[], { version: '1.0.0' }],
		[['hello'], { version: '1.0.0' }],
		[
			['--something', 'comma,separated,value'],
			{ something: 'comma,separated,value', version: '1.0.0' },
		],
		[
			['--hello-world', 'value'],
			{ helloWorld: 'value', version: '1.0.0' },
		],
		[['-pq'], { prefix: true, quiet: true, version: '1.0.0' }],
	])('getOptions', (argv: string[], expected: Decisions) => {

		beforeEach(() => {
			process.argv = [...defaultArgv, ...argv]
		})

		describe('gets options', () => {
			it(getBeforeAfter(argv, expected), async () => {
				// todo: Mock file system.
				const fileSystem = new LocalFileSystem('src', [])
				const cliClient = new CliEntrypoint(fileSystem)
				const received = await cliClient.getOptions()

				expect(received).toStrictEqual(expect.objectContaining(expected))
				// expect(received).toHaveProperty('version', '1.0.0')
			})
		})
	})
})
