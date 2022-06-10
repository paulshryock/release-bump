import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

;(async function() {
	const path = resolve(__dirname, '../', 'LICENSE')
	const content = await readFile(path, 'utf8')
	const regexp = /(\d{4}) Paul Shryock\n\n/
	const hasYear = regexp.test(content) === true
	const latestYear = parseInt(regexp.exec(content)?.[1] ?? '')
	const currentYear = new Date().getFullYear()

	if (hasYear === false || latestYear === currentYear) return

	// Bump copyright year.
	await writeFile(
		path,
		content.replace(regexp, `${currentYear} Paul Shryock\n\n`),
		'utf8',
	).then(() => {
		console.debug(`bumped license current year to ${currentYear}`)
	})
})()
