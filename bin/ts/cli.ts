#!/usr/bin/env node
import meow from 'meow'
import { ReleaseBump, ReleaseBumpOptions } from '../../src/index.js'

const cli = meow(
	`
	Usage
	  $ release-bump <input>

	Options
	  --changelogPath Include a rainbow
	  --date					Include a rainbow
	  --dryRun,    -d Include a rainbow
	  --filesPath, -f Include a rainbow
	  --quiet,     -q Include a rainbow
	  --prefix,    -p Include a rainbow
	  --release,   -r Include a rainbow
	  --remote        Include a rainbow
	  --repository    Include a rainbow

	Examples
	  $ release-bump
`,
	{
		importMeta: import.meta,
		flags: {
			changelogPath: { type: 'string' },
			date: { type: 'string' },
			dryRun: { type: 'boolean', alias: 'd' },
			filesPath: { type: 'string', alias: 'f' },
			quiet: { type: 'boolean', alias: 'q' },
			prefix: { type: 'boolean', alias: 'p' },
			release: { type: 'string', alias: 'r' },
			remote: { type: 'string' },
			repository: { type: 'string' },
		},
	},
)

;(async function () {
	const {
		changelogPath,
		date,
		dryRun,
		filesPath,
		quiet,
		prefix,
		release,
		remote,
		repository,
	} = cli.flags

	/** Release Bump options. */
	const options: ReleaseBumpOptions = {
		release: release ?? 'todo',
	}
	if (typeof changelogPath === 'string') options.changelogPath = changelogPath
	if (typeof date === 'string') options.date = date
	if (typeof dryRun === 'boolean') options.dryRun = dryRun
	if (typeof filesPath === 'string') options.filesPath = filesPath
	if (typeof quiet === 'boolean') options.quiet = quiet
	if (prefix === true) options.prefix = 'v'
	if (remote === 'bitbucket' || remote === 'github') options.remote = remote
	if (typeof repository === 'string') options.repository = repository

	const releaseBump = new ReleaseBump(options)
	await releaseBump.init()
})()
