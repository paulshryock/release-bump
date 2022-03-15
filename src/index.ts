import {
	filterFiles,
	formatChangelogText,
	formatDocblock,
	formatRepositoryUrl,
	getRecursiveFilePaths,
} from './lib.js'
import { readFileSync } from 'node:fs'
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

/** Release Bump settings. */
export interface ReleaseBumpSettings extends ReleaseBumpOptions {
	changelogPath: string
	date: string
	dryRun: boolean
	failOnError: boolean
	filesPath: string
	ignore: string[]
	prefix: boolean
	quiet: boolean
	release: string
	repository: string
}

/**
 * Release Bump.
 *
 * @since 3.0.0
 */
export class ReleaseBump {
	/** Release Bump settings. */
	#settings: ReleaseBumpSettings

	/**
	 * ReleaseBump class constructor.
	 *
	 * @since 3.0.0
	 * @param {ReleaseBumpOptions} options Release Bump options.
	 */
	constructor(options: ReleaseBumpOptions) {
		/** Parsed package.json content. */
		let pkg = { repository: '', version: '0.0.0' }

		try {
			pkg = JSON.parse(readFileSync('package.json', 'utf8'))
		} catch (error: any) {
			if (process.env.NODE_ENV !== 'test' && options.quiet !== true) {
				console.warn('could not read package.json')
			}
		}

		/** Release Bump defaults. */
		const defaults: ReleaseBumpSettings = {
			changelogPath: 'CHANGELOG.md',
			date: new Date().toISOString().split('T')?.[0],
			dryRun: false,
			failOnError: false,
			filesPath: '.',
			ignore: ['node_modules', 'tests/fixtures'],
			prefix: false,
			quiet: process.env.NODE_ENV === 'test' || false,
			release: pkg.version,
			repository: formatRepositoryUrl(pkg.repository),
		}

		this.#settings = { ...defaults, ...options }
	}

	/**
	 * Bumps Changelog.
	 *
	 * @since 3.0.0
	 * @todo  Refactor.
	 */
	private async bumpChangelog(): Promise<void> {
		const {
			changelogPath,
			date,
			dryRun,
			failOnError,
			prefix,
			quiet,
			release,
			repository,
		} = this.#settings

		const file = changelogPath

		/** Unformatted text. */
		let unformattedText = ''
		try {
			unformattedText = await readFile(file, 'utf8')
		} catch (error: any) {
			if (failOnError) {
				process.exitCode = 1
				throw error
			} else {
				console.warn(`could not read ${file}`)
			}
		}

		/** Formatted text. */
		const formattedText = formatChangelogText(unformattedText, {
			date,
			prefix,
			release,
			repository,
		})

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
	}

	/**
	 * Bumps Docblocks.
	 *
	 * @since 3.0.0
	 * @todo  Refactor.
	 */
	private async bumpDocblock(): Promise<void> {
		const { dryRun, failOnError, filesPath, ignore, quiet, release } =
			this.#settings

		/** File paths. */
		const filePaths: string[] = getRecursiveFilePaths(filesPath)

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
			return
		}

		await Promise.all(
			filteredFilePaths.map(async (file) => {
				/** Unformatted text. */
				let unformattedText = ''
				try {
					unformattedText = await readFile(file, 'utf8')
				} catch (error: any) {
					if (failOnError) {
						process.exitCode = 1
						throw error
					} else {
						console.warn(`could not read ${file}`)
					}
				}

				/** Formatted text. */
				const formattedText = formatDocblock(unformattedText, { release })

				if (unformattedText === formattedText) return

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
	}

	/**
	 * Initializes Release Bump.
	 *
	 * @since 3.0.0
	 * @todo  Refactor.
	 */
	public async init(): Promise<void> {
		await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
	}
}
