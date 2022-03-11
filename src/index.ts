import { fileExists, getFileContent } from './lib.js'
import { NonEmptyString } from './types.js'
import { writeFile } from 'node:fs/promises'

export interface ReleaseBumpOptions {
	changelogPath?: string
	date?: string
	dryRun?: boolean
	files?: string[]
	quiet?: boolean
	prefix?: 'v'
	remote?: 'bitbucket' | 'github'
	repository?: string
	version: string
}

/**
 * ReleaseBump class.
 *
 * @since unreleased
 */
export class ReleaseBump {
	#changelogPath: undefined | string
	#date: undefined | string
	#dryRun: undefined | boolean
	#files: undefined | string[]
	#quiet: boolean
	#prefix: '' | 'v'
	#remote: undefined | 'bitbucket' | 'github'
	#repository: undefined | string
	#version: string

	/**
	 * ReleaseBump class constructor.
	 *
	 * @since unreleased
	 * @param {ReleaseBumpOptions} options Release Bump options.
	 */
	constructor(options: ReleaseBumpOptions) {
		const {
			changelogPath,
			date,
			dryRun,
			files,
			prefix,
			quiet,
			remote,
			repository,
			version,
		} = options
		this.#changelogPath = changelogPath
		this.#date = date
		this.#dryRun = dryRun || false
		this.#files = files ?? []
		this.#quiet = (process.env.NODE_ENV === 'test' || quiet) ?? false
		this.#prefix = prefix || ''
		this.#remote = remote
		this.#repository = repository
		this.#version = version
	}

	/**
	 * Bumps Changelog.
	 *
	 * @since unreleased
	 */
	private async bumpChangelog(): Promise<void> {
		if (typeof this.#changelogPath === 'undefined') return

		const exists = await fileExists(this.#changelogPath)
		if (exists !== true) {
			if (this.#quiet === false) console.info('changelog not found')
			return
		}

		const prefix = this.#prefix ?? ''

		const date: NonEmptyString = new Date(this.#date ?? new Date())
			.toISOString()
			.split('T')?.[0]

		const header = `## [${this.#version}](${this.#repository}/${
			this.#remote === 'bitbucket' ? 'commits/tag' : 'releases/tag'
		}/${prefix}${this.#version}) - ${date}`

		const unreleased =
			`## [Unreleased](${this.#repository}/${
				this.#remote === 'bitbucket' ? 'branches/' : ''
			}compare/HEAD..${prefix}${this.#version})` +
			'\n\n### Added' +
			'\n\n### Changed' +
			'\n\n### Deprecated' +
			'\n\n### Removed' +
			'\n\n### Fixed' +
			'\n\n### Security'

		const text = (await getFileContent(this.#changelogPath))
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

		if (this.#dryRun === true) {
			if (this.#quiet === false) {
				console.info('changelog text:')
				console.info(text)
			}
			return
		}

		await writeFile(this.#changelogPath, text, 'utf8')
		if (this.#quiet === false) console.info('bumped changelog')
	}

	/**
	 * Bumps Docblocks.
	 *
	 * @since unreleased
	 */
	private async bumpDocblock(): Promise<void> {
		if (typeof this.#files === 'undefined') return

		if (this.#files.length < 1) {
			if (this.#quiet === false) console.info('no files to bump')
			return
		}

		if (this.#dryRun === true) {
			if (this.#quiet === false) {
				console.info('files to bump:')
			}
		}

		await Promise.all(
			this.#files.map(async (file) => {
				const exists = await fileExists(file)
				if (exists !== true) {
					if (this.#dryRun === false && this.#quiet === false) {
						console.info(`${file} does not exist`)
					}
					return
				}

				if (this.#dryRun === true) {
					if (this.#quiet === false) {
						console.info(file)
					}
					return
				}

				const content = await getFileContent(file)
				const text = content.replace(
					/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
					`@$1$2${this.#version}`,
				)

				await writeFile(file, text, 'utf8')
			}),
		)

		if (this.#dryRun === true || this.#quiet === true) return

		console.info(`bumped dockblocks`)
	}

	/**
	 * Initializes Release Bump.
	 *
	 * @since unreleased
	 */
	public async init(): Promise<void> {
		await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
	}
}
