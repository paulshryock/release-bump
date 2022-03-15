import { ReleaseBump } from '../src/index.js'

test('ReleaseBump class constructor', () => {
	const actual = new ReleaseBump({})
	expect(actual).toBeInstanceOf(ReleaseBump)
})

test.todo('bumps changelog')
test.todo('bumps docblocks')
