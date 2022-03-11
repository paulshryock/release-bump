import { ReleaseBump, ReleaseBumpOptions } from '../src/index.js'
import { fileExists, getFileContent } from '../src/lib.js'
import { mkdir, rm, writeFile } from 'node:fs/promises'

beforeAll(async () => {
	if ((await fileExists('./temp')) === false) {
		await mkdir('./temp')
	}
})

test('bumps changelog', async () => {
	const changelogPath = './temp/CHANGELOG.md'
	await writeFile(
		changelogPath,
		await getFileContent('./tests/fixtures/CHANGELOG-before.md'),
		'utf8',
	)

	const options: ReleaseBumpOptions = {
		changelogPath,
		date: '2022-03-11',
		remote: 'github',
		repository: 'https://github.com/paulshryock/release-bump',
		version: '3.0.0',
	}
	const releaseBump = new ReleaseBump(options)
	await releaseBump.init()

	const actual = await getFileContent(changelogPath)
	const expected = await getFileContent('./tests/fixtures/CHANGELOG-after.md')

	expect(actual).toBe(expected)
})

test('bumps docblocks', async () => {
	// Create the files.
	const files = ['./temp/style.css', './temp/script.js']
	const extension = /\.(scss|sass|css|ts|tsx|js|jsx|php|html)/
	await Promise.all(
		files.map(async (file) => {
			const content = await getFileContent(
				`./tests/fixtures/${file
					.replace('./temp/', '')
					.replace(extension, '-before.$1')}`,
			)
			await writeFile(file, content, 'utf8')
		}),
	)

	// Bump docblocks.
	const options: ReleaseBumpOptions = {
		files,
		version: '3.0.0',
	}
	const releaseBump = new ReleaseBump(options)
	await releaseBump.init()

	// Expect files to have bumped docblocks.
	files.forEach(async (file) => {
		const actual = await getFileContent(file)
		const expected = await getFileContent(
			`./tests/fixtures/${file
				.replace('./temp/', '')
				.replace(extension, '-after.$1')}`,
		)

		expect(actual).toBe(expected)
	})
})

afterAll(async () => {
	if ((await fileExists('./temp')) === true) {
		await rm('./temp', { force: true, recursive: true })
	}
})
