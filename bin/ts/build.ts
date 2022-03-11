import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { $ } from 'zx'

const { BUILD_WATCH } = process.env
const WATCH = BUILD_WATCH === 'true'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = {
	dist: 'dist',
	js: {
		src: join(__dirname, '../../src/index.ts'),
		dist: join(__dirname, '../../dist/index.js'),
	},
}

;(async function() {
	await $`esbuild ${paths.js.src} \
		--bundle \
		--format=esm \
		--minify \
		--outfile=${paths.js.dist} \
		--platform=node \
		--target=node8 \
		${WATCH ? '--watch' : ''}`
})()
