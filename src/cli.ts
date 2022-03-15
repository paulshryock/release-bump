#!/usr/bin/env node
import { ReleaseBump, ReleaseBumpOptions } from './index.js'

// const usage = `
// 	Usage
// 		$ release-bump <options>

// 	Options
// 		--changelogPath,    Path to changelog.
// 		--date					    Release date.
// 		--dryRun,        -d Dry run.
// 		--filesPath,        Path to directory of files to bump.
// 		--prefix,        -p Prefix release version with a 'v'.
// 		--quiet,         -q Quiet, no logs.
// 		--release,          Release version.
// 		--repository        Remote git repository URL.
// 		--version        -v Release Bump version.

// 	Examples
// 		$ release-bump -pq --files=src
// `
;(async function() {
	const cliOptions = [
		{
			argument: 'changelogPath',
			description: 'Path to changelog.',
			type: 'string',
		},
		{
			argument: 'date',
			description: 'Release date.',
			type: 'string',
		},
		{
			argument: 'dryRun',
			alias: 'd',
			description: 'Dry run.',
			type: 'boolean',
		},
		{
			argument: 'filesPath',
			description: 'Path to directory of files to bump.',
			type: 'string',
		},
		{
			argument: 'prefix',
			alias: 'p',
			description: "Prefix release version with a 'v'.",
			type: 'boolean',
		},
		{
			argument: 'quiet',
			alias: 'q',
			description: 'Quiet, no logs.',
			type: 'boolean',
		},
		{
			argument: 'release',
			description: 'Release version.',
			type: 'string',
		},
		{
			argument: 'repository',
			description: 'Remote git repository URL.',
			type: 'string',
		},
		{
			argument: 'version',
			alias: 'v',
			description: 'Remote git repository URL.',
			type: 'boolean',
		},
	]
	const args = process.argv
		.slice(2)
		.reduce((all: { [key: string]: any }, current: string, index: number) => {
			const modified: { [key: string]: any } = {}

			// Argument.
			if (current.indexOf('--') === 0) {
				const [key, value] = current.substr(2).split('=')
				const cliOption = cliOptions.find(
					(cliOption) => cliOption.argument === key,
				)
				if (cliOption) {
					modified[key] =
						cliOption.type === 'boolean' ? true : value ?? `$${index}`
				}
				// Alias.
				// todo: allow combining aliases.
			} else if (current.indexOf('-') === 0) {
				const cliOption = cliOptions.find(
					(cliOption) => cliOption.alias === current.substr(1),
				)
				if (cliOption) {
					modified[cliOption.argument] = true
				}
				// Value.
			} else {
				const keys = Object.keys(all)
				const key = keys[keys.length - 1]
				if (all[key] === `$${index - 1}`) {
					modified[key] = current
				}
			}

			return {
				...all,
				...modified,
			}
		}, {})

	// const {
	// 	changelogPath,
	// 	date,
	// 	dryRun,
	// 	filesPath,
	// 	quiet,
	// 	prefix,
	// 	release,
	// 	repository,
	// } = args

	/** Release Bump options. */
	const options: ReleaseBumpOptions = {
		...args,
		dryRun: true,
	}
	// if (typeof changelogPath !== 'undefined') {
	// 	options.changelogPath = changelogPath
	// }
	// if (typeof date !== 'undefined') options.date = date
	// if (typeof dryRun !== 'undefined') options.dryRun = dryRun
	// if (typeof filesPath !== 'undefined') options.filesPath = filesPath
	// if (typeof quiet !== 'undefined') options.quiet = quiet
	// if (typeof prefix !== 'undefined') options.prefix = prefix
	// if (typeof release !== 'undefined') options.release = release
	// if (typeof repository !== 'undefined') options.repository = repository

	const releaseBump = new ReleaseBump(options)
	await releaseBump.init()
})()
