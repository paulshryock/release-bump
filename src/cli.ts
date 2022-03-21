#!/usr/bin/env node
import { releaseBump } from './index.js'
import { getHelpText, getVersionText, parseCliArgs } from './lib.js'
;(async function() {
	const { help, version, ...options } = parseCliArgs(
		process.argv?.slice(2) ?? [],
	)

	if (help === true) return console.info(getHelpText())
	if (version === true) return console.info(await getVersionText())

	await releaseBump(options)
})()
