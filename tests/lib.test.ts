import {
	filterFiles,
	formatChangelogText,
	formatDocblock,
	formatRepositoryUrl,
	getCliUsageText,
	getReleaseBumpVersion,
	parseCliArgs,
} from '../src/lib.js'
import { basename, extname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

test('filters file paths', () => {
	/** File paths. */
	const filePaths = [
		'src/index.ts',
		'tests/index-test.ts',
		'tests/fixtures/index.ts',
		'node_modules/some-module/index.ts',
	]

	/** Directories to ignore. */
	const directoriesToIgnore = ['node_modules', 'tests/fixtures']

	const actual = filterFiles(filePaths, directoriesToIgnore)
	const expected = ['src/index.ts', 'tests/index-test.ts']

	expect(actual).toStrictEqual(expected)
})

test('formats changelog text', () => {
	const scenarios = [
		// 0. GitHub with prefix.
		{
			date: '2022-03-11',
			prefix: true,
			release: '3.0.0',
			repository: 'https://github.com/paulshryock/release-bump',
		},
		// 1. GitHub without prefix.
		{
			date: '2022-03-11',
			prefix: false,
			release: '3.0.0',
			repository: 'https://github.com/paulshryock/release-bump',
		},
		// 2. Bitbucket with prefix.
		{
			date: '2022-03-11',
			prefix: true,
			release: '3.0.0',
			repository: 'https://bitbucket.org/paulshryock/release-bump',
		},
		// 3. Bitbucket without prefix.
		{
			date: '2022-03-11',
			prefix: false,
			release: '3.0.0',
			repository: 'https://bitbucket.org/paulshryock/release-bump',
		},
		// 4. No repository with prefix.
		{
			date: '2022-03-11',
			prefix: true,
			release: '3.0.0',
			repository: '',
		},
		// 5. No repository without prefix.
		{
			date: '2022-03-11',
			prefix: false,
			release: '3.0.0',
			repository: '',
		},
	]

	scenarios.forEach(async (scenario, index) => {
		const actual = formatChangelogText(
			await readFile(
				resolve(__dirname, 'fixtures', 'changelog', 'CHANGELOG-before.md'),
				'utf8',
			),
			scenario,
		)
		const expected = await readFile(
			resolve(
				__dirname,
				'fixtures',
				'changelog',
				`CHANGELOG-${index}-after.md`,
			),
			'utf8',
		)
		expect(actual).toBe(expected)
	})
})

test('formats docblock', () => {
	const files = ['script.ts', 'style.scss']
	const release = '3.0.0'

	files.forEach(async (file) => {
		const filename = basename(file, extname(file))
		const actual = formatDocblock(
			await readFile(
				resolve(
					__dirname,
					'fixtures',
					file.replace(filename, `${filename}-before`),
				),
				'utf8',
			),
			{ release },
		)
		const expected = await readFile(
			resolve(
				__dirname,
				'fixtures',
				file.replace(filename, `${filename}-after`),
			),
			'utf8',
		)
		expect(actual).toBe(expected)
	})
})

test('formats remote git repository url', () => {
	const expectations = [
		{
			actual: formatRepositoryUrl(''),
			expected: '',
		},
		{
			actual: formatRepositoryUrl('something'),
			expected: '',
		},
		{
			actual: formatRepositoryUrl('org/repo'),
			expected: 'https://github.com/org/repo',
		},
		{
			actual: formatRepositoryUrl('org/repo', { remote: 'bitbucket' }),
			expected: 'https://bitbucket.org/org/repo',
		},
		{
			actual: formatRepositoryUrl('https://github.com/org/repo'),
			expected: 'https://github.com/org/repo',
		},
	]

	expectations.forEach((expectation) => {
		expect(expectation.actual).toBe(expectation.expected)
	})
})

test.todo('gets all file paths in a directory recursively')

test('gets cli usage text', () => {
	const actual = getCliUsageText()
	expect(typeof actual === 'string')
	expect(actual.toLowerCase().includes('release-bump'))
	expect(actual.toLowerCase().includes('usage'))
	expect(actual.toLowerCase().includes('options'))
	expect(actual.toLowerCase().includes('examples'))
})

test('gets release bump version', async () => {
	process.env.RELEASE_BUMP_VERSION = '3.0.0'
	expect(await getReleaseBumpVersion()).toBe('v3.0.0')

	delete process.env.RELEASE_BUMP_VERSION
	expect(await getReleaseBumpVersion()).toBe('no version found')
})

test('parses cli arguments', () => {
	/** Parsed aliases. */
	const parsedAliases = {
		dryRun: true,
		failOnError: true,
		help: true,
		prefix: true,
		quiet: true,
		version: true,
	}

	/** Parsed arguments. */
	const parsedArguments = {
		...parsedAliases,
		changelogPath: 'CHANGELOG.md',
		date: '2022-03-15',
		filesPath: 'src',
		ignore: ['node_modules', 'tests/fixtures'],
		release: '3.0.0',
		repository: 'org/repo',
	}

	const expectations = [
		// 0. Nothing.
		{
			actual: parseCliArgs([]),
			expected: {},
		},
		// 1. Unused args.
		{
			actual: parseCliArgs(['hello', 'world']),
			expected: {},
		},
		// 2. Arguments with spaces.
		{
			actual: parseCliArgs([
				'--changelogPath',
				'CHANGELOG.md',
				'--date',
				'2022-03-15',
				'--dryRun',
				'--failOnError',
				'--filesPath',
				'src',
				'--ignore',
				'node_modules,tests/fixtures',
				'--help',
				'--prefix',
				'--quiet',
				'--release',
				'3.0.0',
				'--repository',
				'org/repo',
				'--version',
			]),
			expected: parsedArguments,
		},
		// 3. Arguments with equals.
		{
			actual: parseCliArgs([
				'--changelogPath=CHANGELOG.md',
				'--date=2022-03-15',
				'--dryRun',
				'--failOnError',
				'--filesPath=src',
				'--ignore=node_modules,tests/fixtures',
				'--help',
				'--prefix',
				'--quiet',
				'--release=3.0.0',
				'--repository=org/repo',
				'--version',
			]),
			expected: parsedArguments,
		},
		// 4. Aliases.
		{
			actual: parseCliArgs(['-d', '-e', '-h', '-p', '-q', '-v']),
			expected: parsedAliases,
		},
	]

	expectations.forEach((expectation) => {
		expect(expectation.actual).toStrictEqual(expectation.expected)
	})
})
