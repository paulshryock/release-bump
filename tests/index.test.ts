import { releaseBump } from '../src/index.js'

describe('releaseBump', () => {
	describe('with empty options', () => {
		test('bumps changelog and docblocks', async () => {
			const actual = await releaseBump({})
			const expected: string[] = ['CHANGELOG.md', 'src/index.ts', 'src/lib.ts']
			expect(actual).toEqual(expect.arrayContaining(expected))
		})
	})

	describe('with non-existant filesPath', () => {
		test('bumps changelog and docblocks', async () => {
			const actual = await releaseBump({ filesPath: 'path/to/nothing' })
			const expected: string[] = ['CHANGELOG.md']
			expect(actual).toStrictEqual(expected)
		})
	})
})
