import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = {
	module: {
		src: join(__dirname, '../src/index.ts'),
		dist: join(__dirname, '../dist/index.js'),
	},
	cli: {
		src: join(__dirname, '../src/cli.ts'),
		dist: join(__dirname, '../dist/cli.js'),
	},
}

;(async function() {
	/** Parsed package.json content. */
	const pkg = JSON.parse(
		await readFile(resolve(__dirname, '..', 'package.json'), 'utf8'),
	)

	// Define environment variables.
	const proc = JSON.stringify({
		env: {
			RELEASE_BUMP_VERSION: pkg.version,
		},
	})

	// Bundle module.
	await $`esbuild ${paths.module.src} \
		--bundle \
		--define:process=${proc} \
		--format=esm \
		--minify \
		--outfile=${paths.module.dist} \
		--platform=node \
		--target=node8`

	// todo: Types.

	// CLI.
	await $`esbuild ${paths.cli.src} \
		--define:process=${proc} \
		--format=esm \
		--minify \
		--outfile=${paths.cli.dist} \
		--platform=node \
		--target=node11`
})()
