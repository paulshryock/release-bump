import {
	filterFiles,
	formatChangelogText,
	FormatChangelogTextOptions,
	formatDocblock,
	FormatDocblockOptions,
	getRecursiveFilePaths,
	parseSettingsFromOptions,
	ReleaseBumpSettings,
} from './lib.js'
import { readFile, writeFile } from 'node:fs/promises'

/** Release Bump options. */
export interface ReleaseBumpOptions {
	/** Path to changelog. */
	changelogPath?: string
	/** Release date. */
	date?: string
	/** Dry run. */
	dryRun?: boolean
	/** Fail on error. */
	failOnError?: boolean
	/** Path to directory of files to bump. */
	filesPath?: string
	/** Directories to ignore. */
	ignore?: string[]
	/** Prefix release version with a 'v'. */
	prefix?: boolean
	/** Quiet, no logs. */
	quiet?: boolean
	/** Release version. */
	release?: string
	/** Remote git repository URL. */
	repository?: string
}

/**
 * Bumps Changelog.
 *
 * @since  3.0.0
 * @return {Promise<string>} Changelog file path.
 * @todo   Refactor, inject dependencies.
 */
async function bumpChangelog(settings: ReleaseBumpSettings): Promise<string> {
	const {
		changelogPath,
		date,
		dryRun,
		failOnError,
		prefix,
		quiet,
		release,
		repository,
	} = settings

	const file = changelogPath

	/** Unformatted text. */
	let unformatted = ''
	try {
		unformatted = await readFile(file, 'utf8')
	} catch (error: any) {
		if (failOnError) {
			process.exitCode = 1
			throw error
		} else {
			console.warn(`could not read ${file}`)
		}
	}

	/** formatChangelogText options. */
	const options: FormatChangelogTextOptions = {
		date,
		prefix,
		release,
		repository,
	}

	/** Formatted text. */
	const formattedText = formatChangelogText(unformatted, options)

	if (dryRun !== true) {
		try {
			await writeFile(file, formattedText, 'utf8')
		} catch (error: any) {
			if (failOnError) {
				process.exitCode = 1
				throw error
			} else {
				console.warn(`could not write ${file}`)
			}
		}
	}

	if (quiet !== true) {
		console.info((dryRun ? 'would have ' : '') + `bumped ${file}`)
	}

	return dryRun ? '' : file
}

/**
 * Bumps Docblocks.
 *
 * @since  3.0.0
 * @return {Promise<string[]>} Files to bump.
 * @todo   Refactor, inject dependencies.
 */
async function bumpDocblock(settings: ReleaseBumpSettings): Promise<string[]> {
	const { dryRun, failOnError, filesPath, ignore, quiet, release } = settings

	/** File paths. */
	const filePaths: string[] = await getRecursiveFilePaths(filesPath)

	/** Directory paths to ignore. */
	const directoriesToIgnore: string[] = ignore

	/** Filtered file paths. */
	const filteredFilePaths: string[] = filterFiles(
		filePaths,
		directoriesToIgnore,
	)

	/** Files to bump. */
	const filesToBump: string[] = []

	if (filteredFilePaths.length < 1) {
		if (quiet !== true) console.info('no files to bump')
		return []
	}

	await Promise.all(
		filteredFilePaths.map(async (file) => {
			/** Unformatted text. */
			let unformatted = ''
			try {
				unformatted = await readFile(file, 'utf8')
			} catch (error: any) {
				if (failOnError) {
					process.exitCode = 1
					throw error
				} else {
					console.warn(`could not read ${file}`)
				}
			}

			/** formatDocblock options. */
			const options: FormatDocblockOptions = { release }

			/** Formatted text. */
			const formattedText = formatDocblock(unformatted, options)

			if (unformatted === formattedText) return

			filesToBump.push(file)

			if (dryRun === true) return

			try {
				await writeFile(file, formattedText, 'utf8')
			} catch (error: any) {
				if (failOnError) {
					process.exitCode = 1
					throw error
				} else {
					console.warn(`could not write ${file}`)
				}
			}
		}),
	)

	if (filesToBump.length > 0 && quiet !== true) {
		console.info(
			(dryRun ? 'would have ' : '') + `bumped ${filesToBump.join(', ')}`,
		)
	}

	return dryRun ? [] : filesToBump
}

/**
 * Release Bump.
 *
 * @since  unreleased
 * @param  {ReleaseBumpOptions} options Release Bump options.
 * @return {string[]}                   Bumped files.
 * @todo                                Inject dependencies.
 */
export async function releaseBump(
	options: ReleaseBumpOptions,
): Promise<string[]> {
	/** Release Bump settings. */
	const settings = parseSettingsFromOptions(options)

	const files =
		(
			await Promise.all([bumpChangelog(settings), bumpDocblock(settings)])
		)?.flat() ?? []

	return files
}
