import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const files = [
	'CHANGELOG.md',
	'CODE_OF_CONDUCT.md',
	'CONTRIBUTING.md',
	'LICENSE',
	'README.md',
]

/**
 * Copies repo files.
 *
 * @since  unreleased
 * @return {Promise<void>}
 */
export async function copyRepoFiles() {
	// Create directory.
	await mkdir(resolve(__dirname, '..', 'content', 'repo'), {
		recursive: true,
	})

	// Copy files.
	return await Promise.all([
		files.map(async (file: string) => {
			return await copyFile(
				resolve(__dirname, '..', '..', file),
				resolve(
					__dirname,
					'..',
					'content',
					'repo',
					`${file.split('.md')[0]}.md`,
				),
			)
		}),
		await writeFile(
			resolve(__dirname, '..', 'content', 'repo', 'README.json'),
			JSON.stringify({ permalink: './index.html' }),
			'utf8',
		),
	])
}
