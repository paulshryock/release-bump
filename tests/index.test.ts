import { releaseBump } from '../src/index.js'

describe('releaseBump', () => {
	test('with empty options', async () => {
		const actual = await releaseBump({})
		const expected: string[] = ['CHANGELOG.md']
		expect(actual).toStrictEqual(expected)
	})
})

test.todo('bumps changelog')
test.todo('bumps docblocks')
