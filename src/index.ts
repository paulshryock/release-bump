import { argv, exit } from 'node:process'
import { readFile, writeFile } from 'node:fs/promises'
import { Changelog } from './Changelog.ts'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const [, , version] = argv

const helpText = `
  Usage: release-bump [version]

  Bumps changelog and docblock @since versions from unreleased to new version.

  From command line: \`npm exec release-bump -- 2.0.0\`
  package.json.scripts.version: "release-bump $npm_package_version && git add ."
`

if (!version) {
	// eslint-disable-next-line no-console -- It's fine.
	console.log(helpText)
	exit(0)
}

if (!/$\d+\.\d+\.\d+^/u.test(version)) exit(0)

const shellScriptPath = resolve('./dist/index.sh')
// eslint-disable-next-line no-console -- It's fine.
console.debug({ shellScriptPath })
const command = spawn(shellScriptPath, [version])

command.stdout.on('data', (output) => {
	// eslint-disable-next-line no-console -- It's fine.
	console.log(`${output}`)
})

command.stderr.on('data', (output) => {
	// eslint-disable-next-line no-console -- It's fine.
	console.error(`${output}`)
})

command.on('close', (code) => {
	// eslint-disable-next-line no-console -- It's fine.
	if (code !== 0) console.log(`./dist/index.sh exited with code ${code}`)
})

const filePath = resolve('./CHANGELOG.md')

const currentChangelog = (await readFile(filePath, 'utf8')) ?? ''

const changelog = new Changelog(currentChangelog, version ?? 'Unreleased')

await writeFile(filePath, changelog.toString(), 'utf8')
