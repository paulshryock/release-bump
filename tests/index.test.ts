import { releaseBump } from '../src/index.js'

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
