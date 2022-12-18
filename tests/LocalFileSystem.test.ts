import mock from 'mock-fs'
import { LocalFileSystem } from "../src/LocalFileSystem"
import { expect, it } from '@jest/globals';

interface ObjectWithStrings {
	[key: string]: ObjectWithStrings | string
}

const mockedDependencies = {
	'node_modules/escape-string-regexp':
		mock.load('node_modules/escape-string-regexp'),
	'node_modules/jest-message-util':
		mock.load('node_modules/jest-message-util'),
	'node_modules/pretty-format': mock.load('node_modules/pretty-format'),
	'node_modules/react-is': mock.load('node_modules/react-is'),
	'node_modules/stack-utils': mock.load('node_modules/stack-utils'),
}

describe('LocalFileSystem', () => {

  describe.each([
    ['path is ignored', 'node_modules', {}, []],
    ['path is in an ignored directory', 'node_modules/index.js', {}, []],
    ['file does not exist', 'CHANGELOG.md', {}, []],
    ['file exists and is empty', 'CHANGELOG.md', { 'CHANGELOG.md': '' }, []],
    ['file exists and is not empty', 'CHANGELOG.md', { 'CHANGELOG.md': 'contents', }, ['CHANGELOG.md']],
    ['directory exists with zero files', '.', {}, []],
    ['directory exists with one files', '.', { 'file': 'contents' }, ['file']],
    ['directory exists with two files', '.', { 'file': 'contents', 'another-file': 'contents' }, ['file', 'another-file']],
    ['directory exists with one file and an empty file', '.', { 'file': 'contents', 'empty-file': '' }, ['file']],
    [
    	'nested files exist',
    	'src',
    	{ src: { file: 'contents', path: { empty: '', to: { file: 'contents', another: 'contents' } } } },
    	['src/file', 'src/path/to/file', 'src/path/to/another'],
    ],
  ])('getFilePaths', (
    testCase: string,
    path: string,
    mockedFileSystem: ObjectWithStrings,
    expected: string[],
  ) => {

    describe('gets file paths of non-empty existing files', () => {
      beforeEach(() => mock({ ...mockedDependencies, ...mockedFileSystem }))
      afterEach(mock.restore);

      it(`${testCase}`, async () => {
      	const pathsToIgnore: string[] = []
        const myFs = new LocalFileSystem(path, pathsToIgnore)
        const received = await myFs.getFilePaths()

        expect(received).toEqual(expect.arrayContaining(expected))
      })
    })
  })

})
