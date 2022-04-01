import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

;(async function() {
	/** Parsed package.json content. */
	const pkg = JSON.parse(
		await readFile(resolve(__dirname, '..', 'package.json'), 'utf8'),
	)

	/** Process global. */
	const proc = JSON.stringify({
		env: {
			RELEASE_BUMP_VERSION: pkg.version,
		},
	})

	/** Module formats. */
	const moduleFormats = [
		{ name: 'cjs', extension: 'cjs' },
		{ name: 'esm', extension: 'js' },
	]

	/** Files. */
	const files = ['index', 'cli']

	/** Compile source code. */
	await Promise.all(
		moduleFormats.map(async (moduleFormat) => {
			return await Promise.all(
				files.map(async (file) => {
					// Stick with CommonJS CLI for backwards compatibility.
					if (file === 'cli' && moduleFormat.name === 'esm') return

					await $`esbuild ${resolve(__dirname, '..', 'src', `${file}.ts`)} \
						--bundle \
						--define:process=${proc} \
						--format=${moduleFormat.name} \
						--minify \
						--outfile=${resolve(
		__dirname,
		'..',
		'dist',
		`${file}.${moduleFormat.extension}`,
	)} \
						--platform=node \
						--target=node8`
				}),
			)
		}),
	)
})()
