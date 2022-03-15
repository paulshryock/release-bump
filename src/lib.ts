import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/** formatChangelogText options. */
interface formatChangelogTextOptions {
	/** Release date. */
	date: string
	/** Prefix release version with a 'v'. */
	prefix: boolean
	/** Release version. */
	release: string
	/** Remote git repository URL. */
	repository: string
}

/**
 * Formats changelog text.
 *
 * @since  unreleased
 * @param  {string}                     unformatted Unformatted changelog text.
 * @param  {formatChangelogTextOptions} options     Options.
 * @return {string}                                 Formatted changelog text.
 */
export function formatChangelogText(
	unformatted: string,
	options: formatChangelogTextOptions,
): string {
	const { date, prefix, release, repository } = options
	/** Git remote. */
	const remote = repository.includes('bitbucket.org') ? 'bitbucket' : 'github'

	/** Release URL. */
	const releaseUrl = `${repository}/${
		remote === 'bitbucket' ? 'commits' : 'releases'
	}/tag/${prefix ? 'v' : ''}${release}`

	/** Header. */
	const header =
		`## [${prefix ? 'v' : ''}${release}]` +
		(repository !== '' ? `(${releaseUrl})` : '') +
		(date ? ` - ${date}` : '')

	/** Unreleased diff URL. */
	const unreleasedDiffUrl = `(${repository}/${
		remote === 'bitbucket' ? 'branches/' : ''
	}compare/HEAD..${prefix ? 'v' : ''}${release})`

	/** Unreleased. */
	const unreleased =
		`## [Unreleased]${repository ? unreleasedDiffUrl : ''}` +
		'\n\n### Added' +
		'\n\n### Changed' +
		'\n\n### Deprecated' +
		'\n\n### Removed' +
		'\n\n### Fixed' +
		'\n\n### Security'

	return (
		unformatted
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
	)
}

/** formatDocblock options. */
interface formatDocblockOptions {
	/** Release version. */
	release: string
}

/**
 * Formats Docblock.
 *
 * @since  unreleased
 * @param  {string}                text    File text.
 * @param  {formatDocblockOptions} options Options.
 * @return {string}                        Formatted file text.
 */
export function formatDocblock(
	text: string,
	options: formatDocblockOptions,
): string {
	const { release } = options
	return text.replace(
		/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
		`@$1$2${release}`,
	)
}

/** formatRepositoryUrl options. */
interface formatRepositoryUrlOptions {
	/** Git remote. */
	remote?: 'bitbucket' | 'github'
}

/**
 * Formats remote git repository URL.
 *
 * @since  unreleased
 * @param  {string}                     repository Unformatted remote git
 *                                                 repository URL.
 * @param  {formatRepositoryUrlOptions} options    Options.
 * @return {string}                                Formatted remote git
 *                                                 repository URL or ''.
 */
export function formatRepositoryUrl(
	repository: string,
	options: formatRepositoryUrlOptions = {},
): string {
	if (
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
			repository,
		)
	) {
		return repository
	}

	if (
		/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(repository)
	) {
		const origin =
			options.remote === 'bitbucket' ? 'bitbucket.org' : 'github.com'
		return `https://${origin}/${repository}`
	}

	return ''
}

/**
 * Gets all file paths in a directory recursively.
 *
 * @since  unreleased
 * @param  {string}   dir      Directory of files.
 * @param  {string[]} paths=[] File paths.
 * @return {string[]}          Recursive file paths.
 * @todo                       Make this function async.
 * @todo                       Declare or replace __dirname.
 */
export function getRecursiveFilePaths(
	dir: string,
	paths: string[] = [],
): string[] {
	readdirSync(dir).forEach((file) => {
		if (statSync(dir + '/' + file).isDirectory()) {
			paths = getRecursiveFilePaths(`${dir}/${file}`, paths)
		} else {
			if (typeof paths !== 'undefined') {
				paths.push(join(dir, '/', file))
			}
		}
	})

	return paths
}
