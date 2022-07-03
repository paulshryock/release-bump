import {
	filterFilePaths,
	formatText,
	FormatTextOptions,
	getRecursiveFilePaths,
	Logger,
	parseSettingsFromOptions,
} from './lib.js'
import { readFile, writeFile } from 'node:fs/promises'

/** Release Bump options. */
export interface ReleaseBumpOptions {
	/** Path to changelog. */
	changelogPath?: string
	/** Path to config file. */
	configPath?: string
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
	/** Repository. */
	repository?: string
}

/**
 * Bumps Changelog and docblock versions for a code release.
 *
 * Use `unreleased` in your Changelog and docblock comments, and Release Bump
 * will automatically bump it to the correct release version.
 *
 * @since  3.0.0
 * @param  {ReleaseBumpOptions} options Release Bump options.
 * @return {string[]}                   Bumped files.
 * @throws {Error}                      On file system read/write error.
 */
export async function releaseBump(
	options?: ReleaseBumpOptions,
): Promise<string[]> {
	const {
		changelogPath,
		date,
		dryRun,
		failOnError,
		filesPath,
		ignore,
		prefix,
		quiet,
		release,
		repository,
	} = await parseSettingsFromOptions(options)

	/** Logger. */
	const logger = Logger({ quiet })

	/** Directory paths to ignore. */
	const directoriesToIgnore: string[] = ignore

	/** Paths. */
	const paths: string[] = [changelogPath]

	/** File paths. */
	const filePaths: string[] = await getRecursiveFilePaths({
		directoriesToIgnore,
		failOnError,
		filesPath,
		paths,
	})

	/** Filtered file paths. */
	const filteredFilePaths: string[] = filterFilePaths(
		filePaths,
		directoriesToIgnore,
	)

	/** Bumped files. */
	const bumpedFiles: string[] = []

	await Promise.all(
		filteredFilePaths.map(async (filePath) => {
			/** Unformatted text. */
			let unformatted = ''
			try {
				unformatted = await readFile(filePath, 'utf8')
			} catch (error: any) {
				if (failOnError) {
					process.exitCode = 1
					throw error
				} else {
					logger.warn(`could not read ${filePath}`)
				}
			}

			/** formatText options. */
			const formatTextOptions: FormatTextOptions = {
				date,
				isChangelog: changelogPath === filePath,
				prefix,
				quiet,
				release,
				repository,
			}

			/** Formatted text. */
			const formatted = await formatText(unformatted, formatTextOptions)
			if (unformatted === formatted) return

			bumpedFiles.push(filePath)
			if (!dryRun) {
				try {
					await writeFile(filePath, formatted, 'utf8')
				} catch (error: any) {
					if (failOnError) {
						process.exitCode = 1
						throw error
					} else {
						logger.warn(`could not write ${filePath}`, error)
					}
				}
			}
		}),
	)

	if (bumpedFiles.length > 0) {
		logger.info(
			(dryRun ? 'would have ' : '') + `bumped ${bumpedFiles.join(', ')}`,
		)
	}

	return bumpedFiles
}
