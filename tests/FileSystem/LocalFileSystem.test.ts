import mockFs from 'mock-fs'
import { LocalFileSystem } from '../../src/FileSystem/LocalFileSystem'
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from '@jest/globals'

interface ObjectWithStrings {
	[key: string]: ObjectWithStrings | string
}

const mockedDependencies = {
	'node_modules/escape-string-regexp': mockFs.load(
		'node_modules/escape-string-regexp',
	),
	'node_modules/jest-message-util': mockFs.load(
		'node_modules/jest-message-util',
	),
	'node_modules/pretty-format': mockFs.load('node_modules/pretty-format'),
	'node_modules/react-is': mockFs.load('node_modules/react-is'),
	'node_modules/stack-utils': mockFs.load('node_modules/stack-utils'),
}

describe('LocalFileSystem', () => {
	describe.each([
		['path is ignored', 'node_modules', {}, []],
		['path is in an ignored directory', 'node_modules/index.js', {}, []],
		['file does not exist', 'CHANGELOG.md', {}, []],
		['file exists and is empty', 'CHANGELOG.md', { 'CHANGELOG.md': '' }, []],
		[
			'file exists and is not empty',
			'CHANGELOG.md',
			{ 'CHANGELOG.md': 'contents' },
			['CHANGELOG.md'],
		],
		['directory exists with zero files', '.', {}, []],
		['directory exists with one files', '.', { file: 'contents' }, ['file']],
		[
			'directory exists with two files',
			'.',
			{ file: 'contents', 'another-file': 'contents' },
			['file', 'another-file'],
		],
		[
			'directory exists with one file and an empty file',
			'.',
			{ file: 'contents', 'empty-file': '' },
			['file'],
		],
		[
			'nested files exist',
			'src',
			{
				src: {
					file: 'contents',
					path: { empty: '', to: { file: 'contents', another: 'contents' } },
				},
			},
			['src/file', 'src/path/to/file', 'src/path/to/another'],
		],
	])(
		'listFiles',
		(
			testCase: string,
			path: string,
			mockedFileSystem: ObjectWithStrings,
			expected: string[],
		) => {
			describe('lists file paths of non-empty files recursively', () => {
				/** @todo: Pass a null logger into the constructor, don't mock this. */
				let consoleError: Console['error']

				beforeAll(() => {
					consoleError = console.error
					console.error = jest.fn()
				})

				beforeEach(() => {
					mockFs({ ...mockedDependencies, ...mockedFileSystem })
				})

				afterEach(() => {
					mockFs.restore()
				})

				afterAll(() => {
					console.error = consoleError
				})

				it(`${testCase}`, async () => {
					const myFs = new LocalFileSystem(path)
					const received = await myFs.listFiles()

					expect(received).toEqual(expect.arrayContaining(expected))
				})
			})
		},
	)

	describe('readFile', () => {
		describe('file does exist', () => {
			beforeEach(() =>
				mockFs({
					...mockedDependencies,
					'path/to/file': 'content',
				}),
			)

			it(
				'reads the contents of a file from the local file system',
				async () => {
					const fs = new LocalFileSystem('.')

					expect(await fs.readFile('path/to/file')).toBe('content')
				},
			)
		})

		describe('file does not exist', () => {
			beforeEach(() => mockFs(mockedDependencies))

			it('throws a runtime error', async () => {
				const fs = new LocalFileSystem('.', [])

				await expect(async () => {
					await fs.readFile('path/to/file')
				}).rejects.toThrow(Error)
			})
		})

		afterEach(mockFs.restore)
	})

	describe('writeFile', () => {
		beforeEach(() => mockFs(mockedDependencies))

		afterEach(mockFs.restore)

		it('writes a file to the local file system', async () => {
			mockFs({ ...mockedDependencies, 'path/to': {} })

			const fs = new LocalFileSystem('.', [])

			await fs.writeFile('path/to/file', 'content')

			expect(await fs.readFile('path/to/file')).toBe('content')
		})
	})
})
