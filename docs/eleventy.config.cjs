// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('node:path')

/** @type {import('@11ty/eleventy')} */
module.exports = function(eleventyConfig) {
	const origin = 'www-local.releasebump.dev'

	// Add watch targets.
	eleventyConfig.addWatchTarget('./docs/fonts/')
	eleventyConfig.addWatchTarget('./docs/img/')
	eleventyConfig.addWatchTarget('./docs/scss/')
	eleventyConfig.addWatchTarget('./docs/svg/')
	eleventyConfig.addWatchTarget('./docs/ts/')

	// Set server options.
	eleventyConfig.setServerOptions({
		https: {
			key: resolve(__dirname, '../', `${origin}.key`),
			cert: resolve(__dirname, '../', `${origin}.cert`),
		},
		port: 80,
	})

	// Don't use .gitignore.
	eleventyConfig.setUseGitIgnore(false)

	// Set files to ignore.
	eleventyConfig.ignores.add('bin')

	return {
		dir: {
			data: 'data',
			includes: 'includes',
			input: 'docs',
			layouts: 'layouts',
			output: 'docs/dist',
		},
	}
}
