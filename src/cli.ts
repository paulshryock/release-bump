#!/usr/bin/env node
import { releaseBump } from './index.js'
import {
	availableArgs,
	getHelpText,
	getVersionText,
	parseOptionsFromArgs,
} from './lib.js'
;(async function() {
	const passedArgs = process.argv?.slice(2) ?? []
	const { help, version, ...options } = parseOptionsFromArgs(
		passedArgs,
		availableArgs,
	)

	if (help === true) return console.info(getHelpText(availableArgs))
	if (version === true) return console.info(getVersionText(process.env))

	await releaseBump(options)
})()
