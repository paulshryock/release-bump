import { releaseBump } from '../src/index.js'
import { Logger } from '../src/lib.js'

describe('releaseBump', () => {
	describe('with fixtures', () => {
		test('bumps changelog and docblocks', async () => {
			const actual = await releaseBump({
				changelogPath: 'tests/fixtures/changelog/CHANGELOG.md',
				filesPath: 'tests/fixtures',
				ignore: [],
				release: '3.0.0',
			})
			const expected: string[] = [
				'tests/fixtures/changelog/CHANGELOG.md',
				'tests/fixtures/script.ts',
				'tests/fixtures/style.scss',
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
	})

	describe('with non-existant files', () => {
		test('bumps nothing', async () => {
			const actual = await releaseBump({
				changelogPath: 'path/to/nothing/CHANGELOG.md',
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
})

// jest.mock("fs", () => ({
//   promises: {
//     writeFile: jest.fn().mockResolvedValue(),
//     readFile: jest.fn().mockResolvedValue(),
//   },
// }));

// const fs = require("fs");

// ...

// await createNewFile();
// expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
