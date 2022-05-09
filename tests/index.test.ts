import { releaseBump } from '../src/index.js'
import { Logger } from '../src/lib.js'
import { cp, rm, stat } from 'node:fs/promises'

describe('releaseBump', () => {
	describe('with fixtures', () => {
		test('bumps changelog and docblocks', async () => {
			const actual = await releaseBump({
				changelogPath: 'tests/fixtures/changelog/CHANGELOG.md',
				dryRun: true,
				filesPath: 'tests/fixtures',
				ignore: [],
				release: '3.0.0',
			})
			const expected: string[] = [
				'tests/fixtures/changelog/CHANGELOG.md',
				'tests/fixtures/docblock/script.ts',
				'tests/fixtures/docblock/style.scss',
			]
			expect(actual).toEqual(expect.arrayContaining(expected))
		})

		describe('without quiet', () => {
			test('logs to the console', async () => {
				console.info = jest.fn()
				const quiet = false
				const loggerSpy = jest.spyOn(Logger({ quiet }), 'info')
				await releaseBump({
					changelogPath: 'tests/fixtures/changelog/CHANGELOG.md',
					dryRun: true,
					filesPath: 'tests/fixtures',
					ignore: [],
					quiet,
					release: '3.0.0',
				})
				expect(loggerSpy).toHaveBeenCalledTimes(1)
				expect(loggerSpy).toHaveBeenCalledWith(
					expect.stringContaining('bumped'),
				)
			})
		})

		describe('without dryRun', () => {
			beforeAll(async () => {
				await cp('tests/fixtures', 'tests/temp', { recursive: true })
			})

			afterAll(async () => {
				await rm('tests/temp', { recursive: true })
			})

			test('writes to the file system', async () => {
				await releaseBump({
					changelogPath: 'tests/temp/changelog/CHANGELOG.md',
					dryRun: false,
					filesPath: 'tests/temp',
					ignore: [],
					release: '3.0.0',
				})
				const expected: string[] = [
					'tests/temp/changelog/CHANGELOG.md',
					'tests/temp/docblock/script.ts',
					'tests/temp/docblock/style.scss',
				]
				expected.forEach((file) => {
					expect(async () => await stat(file)).not.toThrow()
				})
			})
		})
	})

	describe('with non-existant files', () => {
		test('bumps nothing', async () => {
			const actual = await releaseBump({
				changelogPath: 'path/to/nothing/CHANGELOG.md',
				dryRun: true,
				filesPath: 'path/to/nothing',
				release: '3.0.0',
			})
			const expected: string[] = []
			expect(actual).toStrictEqual(expected)
		})

		describe('with fail on error', () => {
			test('throws ENOENT', async () => {
				try {
					await releaseBump({
						changelogPath: 'not-a-real-CHANGELOG.md',
						dryRun: true,
						failOnError: true,
						filesPath: '.',
						release: '3.0.0',
					})
				} catch (error: any) {
					expect(error.code).toBe('ENOENT')
				}
			})
		})
	})

	describe('with no options', () => {
		test('bumps nothing', async () => {
			const actual = await releaseBump()
			const expected: string[] = []
			expect(actual).toStrictEqual(expected)
		})
	})
})
