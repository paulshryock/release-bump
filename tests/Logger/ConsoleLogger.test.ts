import {
	ConsoleLogger,
	ConsoleLogMethods,
} from '../../src/Logger/ConsoleLogger'
import { LogLevel } from '../../src/Client'
import {
	afterAll,
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from '@jest/globals'
import console from 'node:console'

describe('ConsoleLogger', () => {
	describe.each(Object.values(LogLevel))('log', (logLevel: LogLevel) => {
		let consoleMethod: Console['log']

		beforeEach(() => {
			consoleMethod = console[ConsoleLogMethods[logLevel]]
			console[ConsoleLogMethods[logLevel]] = jest.fn()
		})

		afterAll(() => {
			console[ConsoleLogMethods[logLevel]] = consoleMethod
		})

		it(`logs a "${logLevel}" level message`, () => {
			const logger = new ConsoleLogger()
			logger.log(logLevel, 'message', {})

			expect(console[ConsoleLogMethods[logLevel]]).toHaveBeenCalled()
		})
	})
})
