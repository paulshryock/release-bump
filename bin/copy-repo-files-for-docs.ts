import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
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

await mkdir(resolve(__dirname, '..', 'docs', 'content', 'repo'), {
	recursive: true,
})

// Copy files.
await Promise.all([
	files.map(async (file: string) => {
		return await copyFile(
			resolve(__dirname, '..', file),
			resolve(
				__dirname,
				'..',
				'docs',
				'content',
				'repo',
				`${file.split('.md')[0]}.md`,
			),
		)
	}),
	await writeFile(
		resolve(
			__dirname,
			'..',
			'docs',
			'content',
			'repo',
			'README.json',
		),
		JSON.stringify({ permalink: './index.html' }),
		'utf8',
	)
])
