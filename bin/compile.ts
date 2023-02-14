import esbuild, { BuildContext } from 'esbuild'
import { mkdir } from 'node:fs/promises'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

const PATHS = {
	js: {
		src: ['src/Client.ts'],
		dist: 'dist/index.js',
	},
}

const icons = {
	success: '\x1b[32m✓\x1b[0m',
	error: '\x1b[31m✕\x1b[0m',
	party: '🎉',
}

const { watch } = await yargs(hideBin(process.argv))
	.option('watch', {
		alias: 'w',
		default: false,
		description: 'Watch for changes',
		type: 'boolean',
	})
	.parse()

/**
 * Compiles JavaScript assets.
 *
 * @since  unreleased
 * @return {Promise<void>}
 */
async function compileJavaScript(): Promise<void> {
	await esbuild[watch ? 'context' : 'build']({
		bundle: true,
		entryPoints: PATHS.js.src,
		format: 'esm',
		minifyIdentifiers: false,
		minifySyntax: true,
		minifyWhitespace: true,
		outfile: PATHS.js.dist,
		platform: 'node',
	})
		.then((result) => {
			console.info(`${icons.success} ${PATHS.js.dist}`)
			return result
		})
		.catch(() => console.error(`${icons.error} ${PATHS.js.dist}`))
		.then(async (buildContext) => {
			if (watch && buildContext)
				await (buildContext as BuildContext)
					.watch()
					.then(() => console.info('Watching for JavaScript changes...'))
					.catch((error: any) => {
						console.error(`${icons.error} Failed to compile JavaScript`)
						console.error(error)
					})
		})
}

/**
 * Compiles exported assets.
 *
 * @since  unreleased
 * @return {Promise<void>}
 */
async function compile(): Promise<void> {
	console.log('Compiling to ./dist ...')

	await mkdir('dist', { recursive: true })
		.then(async () => {
			await Promise.all([compileJavaScript()]).then(() =>
				console.log(`${icons.party} Success`),
			)
		})
		.catch((error: any) => {
			console.error(`${icons.error} Failure`)
			console.error(error)
		})
}

compile()
