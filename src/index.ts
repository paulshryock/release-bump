import { fileExists, getFileContent } from './lib.js'
import fg from 'fast-glob'
import { writeFile } from 'node:fs/promises'

/** Release Bump defaults. */
export interface ReleaseBumpDefaults {
	/** Changelog path. */
	changelogPath: 'CHANGELOG.md'
	/** Release date. */
	date: string
	/** Dry run. */
	dryRun: false
	/** Relative path to directory of files to bump. */
	filesPath: '.'
	/** Release version prefix. */
	prefix: ''
	/** Quiet, no logs. */
	quiet: boolean
}

/** Release Bump options. */
export interface ReleaseBumpOptions {
	/** Changelog path. */
	changelogPath?: string
	/** Release date. */
	date?: string
	/** Dry run. */
	dryRun?: boolean
	/** Relative path to directory of files to bump. */
	filesPath?: string
	/** Release version prefix. */
	prefix?: 'v'
	/** Quiet, no logs. */
	quiet?: boolean
	/** Release version. */
	release: string
	/** Git remote. */
	remote?: 'bitbucket' | 'github'
	/** Remote git repository URL. */
	repository?: string
}

/** Release Bump settings. */
export interface ReleaseBumpSettings {
	/** Changelog path. */
	changelogPath: string
	/** Release date. */
	date: string
	/** Dry run. */
	dryRun: boolean
	/** Relative path to directory of files to bump. */
	filesPath: string
	/** Release version prefix. */
	prefix: '' | 'v'
	/** Quiet, no logs. */
	quiet: boolean
	/** Release version. */
	release: string
	/** Git remote. */
	remote?: 'bitbucket' | 'github'
	/** Remote git repository URL. */
	repository?: string
}

/**
 * ReleaseBump class.
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
		/** Release Bump defaults. */
		const defaults: ReleaseBumpDefaults = {
			changelogPath: 'CHANGELOG.md',
			date: new Date().toISOString().split('T')?.[0],
			dryRun: false,
			filesPath: '.',
			prefix: '',
			quiet: process.env.NODE_ENV === 'test' || false,
		}

		/** Release Bump settings. */
		const settings = { ...defaults, ...options }

		// Dynamically set remote.
		if (
			typeof settings.remote === 'undefined' &&
			typeof settings.repository === 'string'
		) {
			try {
				const remote = new URL(settings.repository).host.split('.')[0]
				if (remote === 'bitbucket' || remote === 'github') {
					settings.remote = remote
				}
			} catch (error) {
				if (
					!(error instanceof TypeError) ||
					error.message !== 'URL constructor:  is not a valid URL.'
				) {
					throw error
				}
			}
		}

		this.#settings = settings
	}

	/**
	 * Bumps Changelog.
	 *
	 * @since 3.0.0
	 */
	private async bumpChangelog(): Promise<void> {
		const {
			changelogPath,
			date,
			dryRun,
			prefix,
			quiet,
			release,
			remote,
			repository,
		} = this.#settings

		if (typeof changelogPath === 'undefined') return

		const exists = await fileExists(changelogPath)
		if (exists !== true) {
			if (quiet === false) console.info('changelog not found')
			return
		}

		const header = `## [${release}](${repository}/${
			remote === 'bitbucket' ? 'commits/tag' : 'releases/tag'
		}/${prefix}${release}) - ${date}`

		const unreleased =
			`## [Unreleased](${repository}/${
				remote === 'bitbucket' ? 'branches/' : ''
			}compare/HEAD..${prefix}${release})` +
			'\n\n### Added' +
			'\n\n### Changed' +
			'\n\n### Deprecated' +
			'\n\n### Removed' +
			'\n\n### Fixed' +
			'\n\n### Security'

		const text = (await getFileContent(changelogPath))
			// Bump unreleased version and add date.
			.replace(/## \[Unreleased\](\(.*\))?/, header)
			// Remove empty changelog subheads.
			.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g, '')
			// Remove last empty changelog subhead.
			.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g, '')
			// Remove any duplicate trailing newline.
			.replace(/\n\n$/g, '\n')
			// Add unreleased section.
			.replace(header, unreleased + '\n\n' + header)

		if (dryRun === true) {
			if (quiet === false) {
				console.info('changelog text:')
				console.info(text)
			}
			return
		}

		await writeFile(changelogPath, text, 'utf8')
		if (quiet === false) console.info('bumped changelog')
	}

	/**
	 * Bumps Docblocks.
	 *
	 * @since 3.0.0
	 */
	private async bumpDocblock(): Promise<void> {
		const { dryRun, filesPath, quiet, release } = this.#settings

		/** Files to bump. */
		const files: string[] = await fg([filesPath])

		if (files.length < 1) {
			if (quiet === false) console.info('no files to bump')
			return
		}

		if (dryRun === true) {
			if (quiet === false) {
				console.info('files to bump:')
			}
		}

		await Promise.all(
			files.map(async (file) => {
				const exists = await fileExists(file)
				if (exists !== true) {
					if (dryRun === false && quiet === false) {
						console.info(`${file} does not exist`)
					}
					return
				}

				if (dryRun === true) {
					if (quiet === false) {
						console.info(file)
					}
					return
				}

				const content = await getFileContent(file)
				const text = content.replace(
					/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
					`@$1$2${release}`,
				)

				await writeFile(file, text, 'utf8')
			}),
		)

		if (dryRun === true || quiet === true) return

		console.info(`bumped dockblocks`)
	}

	/**
	 * Initializes Release Bump.
	 *
	 * @since 3.0.0
	 */
	public async init(): Promise<void> {
		await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
	}
}
