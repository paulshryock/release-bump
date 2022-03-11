import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = {
	module: {
		src: join(__dirname, '../../src/index.ts'),
		dist: join(__dirname, '../../dist/index.js'),
	},
	cli: {
		src: join(__dirname, '../../src/cli.ts'),
		dist: join(__dirname, '../../dist/cli.js'),
	},
}

;(async function() {
	// Module.
	await $`esbuild ${paths.module.src} \
		--bundle \
		--format=esm \
		--minify \
		--outfile=${paths.module.dist} \
		--platform=node \
		--target=node8 \
	}`

	// todo: Types.

	// CLI.
	await $`esbuild ${paths.cli.src} \
		--bundle \
		--format=esm \
		--minify \
		--outfile=${paths.cli.dist} \
		--platform=node \
		--target=node8 \
	}`
})()
