import { releaseBump } from '../src/index.js'

test('releaseBump', async () => {
	const actual = await releaseBump({})
	expect(Array.isArray(actual))
})

test.todo('bumps changelog')
test.todo('bumps docblocks')
