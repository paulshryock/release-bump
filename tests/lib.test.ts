import {
	availableArgs,
	filterFilePaths,
	formatRepositoryUrl,
	formatText,
	FormatTextOptions,
	getHelpText,
	getRecursiveFilePaths,
	GetRecursiveFilePathsOptions,
	getVersionText,
	parseOptionsFromArgs,
} from '../src/lib.js'
import { basename, extname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

describe('filterFilePaths', () => {
	describe('without file paths or directories to ignore', () => {
		test('returns an empty array', () => {
			expect(filterFilePaths([], [])).toStrictEqual([])
		})
	})

	describe('with overlapping directories to ignore', () => {
		test('filters file paths', () => {
			const filePaths = ['src/index.ts', 'tests/index-test.ts']
			expect(
				filterFilePaths(
					[
						...filePaths,
						'tests/fixtures/index.ts',
						'node_modules/some-module/index.ts',
					],
					['node_modules', 'tests/fixtures'],
				),
			).toStrictEqual(filePaths)
		})
	})

	describe('with no overlapping directories to ignore', () => {
		test('has all the same file paths', () => {
			const filePaths = [
				'src/index.ts',
				'tests/index-test.ts',
				'tests/fixtures/index.ts',
				'node_modules/some-module/index.ts',
			]
			const actual = filterFilePaths(filePaths, [
				'some/directory',
				'some-other-directory',
			])
			expect(actual).toStrictEqual(filePaths)
		})
	})
})

describe('formatRepositoryUrl', () => {
	describe('with an empty repository', () => {
		test('returns an empty url', () => {
			expect(formatRepositoryUrl('')).toBe('')
		})
	})

	describe('with a wrongly formatted repository', () => {
		test('returns an empty url', () => {
			expect(formatRepositoryUrl('something')).toBe('')
		})
	})

	describe('with an unformatted repository', () => {
		test('returns a formatted url', () => {
			expect(formatRepositoryUrl('org/repo')).toBe(
				'https://github.com/org/repo',
			)
		})
	})

	describe('with a formatted repository url', () => {
		describe('with a github origin', () => {
			test('returns the right formatted url', () => {
				expect(formatRepositoryUrl('https://github.com/org/repo')).toBe(
					'https://github.com/org/repo',
				)
			})
		})

		describe('with a gitlab origin', () => {
			test('returns the right formatted url', () => {
				expect(formatRepositoryUrl('https://gitlab.com/org/repo')).toBe(
					'https://gitlab.com/org/repo',
				)
			})
		})

		describe('with a bitbucket origin', () => {
			test('returns the right formatted url', () => {
				expect(formatRepositoryUrl('https://bitbucket.org/org/repo')).toBe(
					'https://bitbucket.org/org/repo',
				)
			})
		})
	})

	describe('with a repository object', () => {
		describe('with a url key', () => {
			test('that is empty', () => {
				expect(formatRepositoryUrl({ url: '' })).toBe('')
			})

			test('that is a repo path', () => {
				expect(formatRepositoryUrl({ url: 'org/repo' })).toBe(
					'https://github.com/org/repo',
				)
			})

			test('that is a valid url', () => {
				expect(
					formatRepositoryUrl({ url: 'https://github.com/org/repo' }),
				).toBe('https://github.com/org/repo')
			})
		})

		test('without a url key', () => {
			expect(formatRepositoryUrl({})).toBe('')
		})
	})
})

describe('formatText', () => {
	describe('with a changelog', () => {
		describe('with a repository', () => {
			describe('with a prefix', () => {
				test('formats text', async () => {
					const file = 'CHANGELOG.md'
					const filename = basename(file, extname(file))
					const unformatted = await readFile(
						resolve(__dirname, 'fixtures', 'changelog', file),
						'utf8',
					)
					const options: FormatTextOptions = {
						date: '2022-03-11',
						isChangelog: true,
						prefix: true,
						quiet: true,
						release: '3.0.0',
						repository: 'https://github.com/org/repo',
					}
					const actual = await formatText(unformatted, options)
					const expected = await readFile(
						resolve(
							__dirname,
							'fixtures',
							'changelog',
							file.replace(filename, `${filename}-0-after`),
						),
						'utf8',
					)
					expect(actual).toBe(expected)
				})
			})

			describe('without a prefix', () => {
				test('formats text', async () => {
					const file = 'CHANGELOG.md'
					const filename = basename(file, extname(file))
					const unformatted = await readFile(
						resolve(__dirname, 'fixtures', 'changelog', file),
						'utf8',
					)
					const options: FormatTextOptions = {
						date: '2022-03-11',
						isChangelog: true,
						prefix: false,
						quiet: true,
						release: '3.0.0',
						repository: 'https://github.com/org/repo',
					}
					const actual = await formatText(unformatted, options)
					const expected = await readFile(
						resolve(
							__dirname,
							'fixtures',
							'changelog',
							file.replace(filename, `${filename}-1-after`),
						),
						'utf8',
					)
					expect(actual).toBe(expected)
				})
			})
		})

		describe('without a repository', () => {
			test('formats text', async () => {
				const file = 'CHANGELOG.md'
				const filename = basename(file, extname(file))
				const unformatted = await readFile(
					resolve(__dirname, 'fixtures', 'changelog', file),
					'utf8',
				)
				const options: FormatTextOptions = {
					date: '2022-03-11',
					isChangelog: true,
					prefix: false,
					quiet: true,
					release: '3.0.0',
					repository: '',
				}
				const actual = await formatText(unformatted, options)
				const expected = await readFile(
					resolve(
						__dirname,
						'fixtures',
						'changelog',
						file.replace(filename, `${filename}-2-after`),
					),
					'utf8',
				)
				expect(actual).toBe(expected)
			})
		})

		describe('which has already bumped', () => {
			test('returns unformatted text', async () => {
				const file = 'CHANGELOG.md'
				const filename = basename(file, extname(file))
				const unformatted = await readFile(
					resolve(
						__dirname,
						'fixtures',
						'changelog',
						file.replace(filename, `${filename}-1-after`),
					),
					'utf8',
				)
				const options: FormatTextOptions = {
					date: '2022-03-11',
					isChangelog: true,
					prefix: false,
					quiet: true,
					release: '3.0.0',
					repository: 'https://github.com/org/repo',
				}
				const actual = await formatText(unformatted, options)
				expect(actual).toBe(unformatted)
			})
		})
	})

	describe('with a docblock', () => {
		test('formats text', async () => {
			const file = 'script.ts'
			const filename = basename(file, extname(file))
			const unformatted = await readFile(
				resolve(__dirname, 'fixtures', file),
				'utf8',
			)
			const options: FormatTextOptions = {
				date: '2022-03-11',
				isChangelog: false,
				prefix: false,
				quiet: true,
				release: '3.0.0',
				repository: 'https://github.com/org/repo',
			}
			const actual = await formatText(unformatted, options)
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

	describe('with a WordPress-style docblock', () => {
		test('formats text', async () => {
			const file = 'style.scss'
			const filename = basename(file, extname(file))
			const unformatted = await readFile(
				resolve(__dirname, 'fixtures', file),
				'utf8',
			)
			const options: FormatTextOptions = {
				date: '2022-03-11',
				isChangelog: false,
				prefix: false,
				quiet: true,
				release: '3.0.0',
				repository: 'https://github.com/org/repo',
			}
			const actual = await formatText(unformatted, options)
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

	describe('with a pre-release version', () => {
		test('does not format text', async () => {
			const unformatted = await readFile(
				resolve(__dirname, 'fixtures', 'script.ts'),
				'utf8',
			)
			const options: FormatTextOptions = {
				date: '2022-03-11',
				isChangelog: false,
				prefix: false,
				quiet: true,
				release: '3.0.0-alpha.1',
				repository: 'https://github.com/org/repo',
			}
			const actual = await formatText(unformatted, options)
			expect(actual).toBe(unformatted)
		})
	})
})

describe('getHelpText', () => {
	test('gets help text with all arguments', () => {
		const actual = getHelpText(availableArgs)
		expect(typeof actual).toBe('string')
		expect(actual.toLowerCase().includes('release-bump'))
		expect(actual.toLowerCase().includes('usage'))
		expect(actual.toLowerCase().includes('options'))
		expect(actual.toLowerCase().includes('examples'))
		expect(
			availableArgs.every((availableArg) => {
				return (
					actual.includes(availableArg.name) &&
					actual.includes(availableArg.description)
				)
			}),
		)
	})
})

describe('getRecursiveFilePaths', () => {
	describe('with a directory to ignore', () => {
		test('gets all file paths in a directory recursively', async () => {
			/** getRecursiveFilePaths options. */
			const options: GetRecursiveFilePathsOptions = {
				directoriesToIgnore: ['tests/fixtures'],
				failOnError: false,
				filesPath: 'tests',
				paths: [],
			}

			const actual = await getRecursiveFilePaths(options)
			const expected = ['tests/index.test.ts', 'tests/lib.test.ts']
			expect(actual).toEqual(expect.arrayContaining(expected))
		})
	})

	describe('without a directory to ignore', () => {
		test('gets all file paths in a directory recursively', async () => {
			/** getRecursiveFilePaths options. */
			const options: GetRecursiveFilePathsOptions = {
				directoriesToIgnore: [],
				failOnError: false,
				filesPath: 'tests',
				paths: [],
			}

			const actual = await getRecursiveFilePaths(options)
			const expected = ['tests/index.test.ts', 'tests/lib.test.ts']
			expect(actual).toEqual(expect.arrayContaining(expected))
		})

		describe('with non-existant filesPath', () => {
			test('gets an empty array', async () => {
				/** getRecursiveFilePaths options. */
				const options: GetRecursiveFilePathsOptions = {
					directoriesToIgnore: [],
					failOnError: false,
					filesPath: 'path/to/nothing',
					paths: [],
				}
				const actual = await getRecursiveFilePaths(options)
				const expected: string[] = []
				expect(actual).toStrictEqual(expected)
			})

			describe('with fail on error', () => {
				test('throws ENOENT', async () => {
					/** getRecursiveFilePaths options. */
					const options: GetRecursiveFilePathsOptions = {
						directoriesToIgnore: [],
						failOnError: true,
						filesPath: 'path/to/nothing',
						paths: [],
					}
					try {
						await getRecursiveFilePaths(options)
					} catch (error: any) {
						expect(error.code).toBe('ENOENT')
					}
				})
			})
		})
	})
})

describe('getVersionText', () => {
	describe('with version defined', () => {
		test('gets version text', async () => {
			process.env.RELEASE_BUMP_VERSION = '3.0.0'
			expect(await getVersionText(process.env)).toBe('v3.0.0')
		})
	})

	describe('without version defined', () => {
		test('gets no version found', async () => {
			delete process.env.RELEASE_BUMP_VERSION
			expect(await getVersionText(process.env)).toBe('no version found')
		})
	})
})

describe('parseOptionsFromArgs', () => {
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

	describe('with no arguments', () => {
		test('returns empty options', () => {
			expect(parseOptionsFromArgs([], availableArgs)).toStrictEqual({})
		})
	})

	describe('with wrong arguments', () => {
		test('returns empty options', () => {
			expect(
				parseOptionsFromArgs(['--hello', 'world'], availableArgs),
			).toStrictEqual({})
		})
	})

	describe('with space-separated arguments', () => {
		test('returns parsed options', () => {
			expect(
				parseOptionsFromArgs(
					[
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
					],
					availableArgs,
				),
			).toStrictEqual(parsedArguments)
		})
	})

	describe('with equals-separated arguments', () => {
		test('returns parsed options', () => {
			expect(
				parseOptionsFromArgs(
					[
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
					],
					availableArgs,
				),
			).toStrictEqual(parsedArguments)
		})
	})

	describe('with aliases', () => {
		test('returns parsed options', () => {
			expect(
				parseOptionsFromArgs(
					['-d', '-e', '-h', '-p', '-q', '-v'],
					availableArgs,
				),
			).toStrictEqual(parsedAliases)
		})
	})
})
