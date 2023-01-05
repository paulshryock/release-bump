import {
	ConsoleLogger,
	ConsoleLogMethods,
} from '../../src/Logger/ConsoleLogger'
import { LogLevel } from '../../src/Client'
import { describe, expect, it, jest } from '@jest/globals'

describe('ConsoleLogger', () => {
	describe.each(Object.values(LogLevel))('log', (logLevel: LogLevel) => {
		let consoleClone: Console

		beforeAll(() => {
			consoleClone = console
		})

		beforeEach(() => {
			console[ConsoleLogMethods[logLevel]] = jest.fn()
		})

		afterAll(() => {
			console = consoleClone
		})

		it(`logs a "${logLevel}" level message`, () => {
			const logger = new ConsoleLogger()
			logger.log(logLevel, 'message', {})

			expect(console[ConsoleLogMethods[logLevel]]).toHaveBeenCalled()
		})
	})
})
