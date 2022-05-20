import { ProcessEnv } from '../src/lib.js'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** Parsed package.json content. */
const pkg = JSON.parse(
	await readFile(resolve(__dirname, '..', 'package.json'), 'utf8'),
)

/** Modified process.env global. */
const env = JSON.stringify(
	Object.entries(process.env).reduce(
		(inject: ProcessEnv, [key, value]) => {
			const processEnv = { ...inject }
			if (key.includes('RELEASE_BUMP')) processEnv[key] = value
			return processEnv
		},
		{
			RELEASE_BUMP_VERSION: pkg.version,
		},
	),
)

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
					--define:process.env=${env} \
					${file === 'cli' ? '--external:./index.js' : ''} \
					--format=${moduleFormat.name} \
					--minify-syntax \
					--minify-whitespace \
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

// Rewrite require path in compiled CLI.
const compiledCliPath = resolve(__dirname, '..', 'dist', 'cli.cjs')
await writeFile(
	compiledCliPath,
	(await readFile(compiledCliPath, 'utf8')).replaceAll('index.js', 'index.cjs'),
	'utf8',
)

// Rewrite docs homepage from Readme.
await writeFile(
	resolve(__dirname, '..', 'docs', 'index.md'),
	await readFile(resolve(__dirname, '..', 'README.md'), 'utf8'),
	'utf8',
)
