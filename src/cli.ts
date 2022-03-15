#!/usr/bin/env node
import { ReleaseBump, ReleaseBumpOptions } from './index.js'
import { getCliUsageText, getReleaseBumpVersion, parseCliArgs } from './lib.js'

;(async function() {
	const { help, version, ...rest } = parseCliArgs(process.argv.slice(2))

	if (help === true) return console.info(getCliUsageText())

	if (version === true) return console.info(await getReleaseBumpVersion())

	/** Release Bump options. */
	const options: ReleaseBumpOptions = {
		...rest,
	}

	/** Release Bump. */
	const releaseBump = new ReleaseBump(options)
	await releaseBump.init()
})()
