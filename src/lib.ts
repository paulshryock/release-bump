import { ReleaseBumpOptions } from './index.js'
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
 * Filters file paths.
 *
 * @since  3.0.0
 * @param  {string[]} files               File paths.
 * @param  {string[]} directoriesToIgnore Directory paths to ignore.
 * @return {string[]}                     Filtered file paths.
 */
export function filterFiles(
	files: string[],
	directoriesToIgnore: string[],
): string[] {
	return files.filter(
		(file) =>
			!directoriesToIgnore.some((directory) => file.includes(directory)),
	)
}

/**
 * Formats changelog text.
 *
 * @since  3.0.0
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

	/** Semantic release version. */
	const version = (/\d+\.\d+\.\d+/.exec(release))?.[0] ?? release

	/** Release URL. */
	const releaseUrl = `${repository}/${
		remote === 'bitbucket' ? 'commits' : 'releases'
	}/tag/${prefix ? 'v' : ''}${version}`

	/** Header. */
	const header =
		`## [${prefix ? 'v' : ''}${version}]` +
		(repository !== '' ? `(${releaseUrl})` : '') +
		(date ? ` - ${date}` : '')

	/** Unreleased diff URL. */
	const unreleasedDiffUrl = `(${repository}/${
		remote === 'bitbucket' ? 'branches/' : ''
	}compare/HEAD..${prefix ? 'v' : ''}${version})`

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
 * @since  3.0.0
 * @param  {string}                text    File text.
 * @param  {formatDocblockOptions} options Options.
 * @return {string}                        Formatted file text.
 */
export function formatDocblock(
	text: string,
	options: formatDocblockOptions,
): string {
	const { release } = options

	/** Semantic release version. */
	const version = (/\d+\.\d+\.\d+/.exec(release))?.[0] ?? release

	return text.replace(
		/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
		`@$1$2${version}`,
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
 * @since  3.0.0
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
 * @since  3.0.0
 * @param  {string}   dir      Directory of files.
 * @param  {string[]} paths=[] File paths.
 * @return {string[]}          Recursive file paths.
 * @todo                       Make this function async.
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

/**
 * Gets CLI usage text.
 *
 * @since  3.0.0
 * @return {string} CLI usage text.
 */
export function getCliUsageText(): string {
	return `
Usage
	$ release-bump <options>

Options
	--changelogPath     Path to changelog.
	--date              Release date.
	--dryRun,        -d Dry run.
	--failOnError,   -e Fail on error.
	--filesPath         Path to directory of files to bump.
	--help,          -h Log CLI usage text.
	--prefix,        -p Prefix release version with a 'v'.
	--quiet,         -q Quiet, no logs.
	--release           Release version.
	--repository        Remote git repository URL.
	--version,       -v Log Release Bump version.

Examples
	$ release-bump -pq --files=src
`
}

/**
 * Gets Release Bump version.
 *
 * @since  3.0.0
 * @return {Promise<string>} Release Bump version.
 */
export async function getReleaseBumpVersion(): Promise<string> {
	return process.env.RELEASE_BUMP_VERSION
		? 'v' + process.env.RELEASE_BUMP_VERSION
		: 'no version found'
}

interface CliArgs extends ReleaseBumpOptions {
	/** Log CLI usage text. */
	help?: boolean
	/** Log Release Bump version. */
	version?: boolean
}

/**
 * Parses CLI arguments.
 *
 * @since  3.0.0
 * @param  {string[]} args CLI arguments.
 * @return {CliArgs}       Parsed CLI arguments.
 */
export function parseCliArgs(args: string[]): CliArgs {
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
			argument: 'failOnError',
			alias: 'e',
			description: 'Fail on error.',
			type: 'boolean',
		},
		{
			argument: 'filesPath',
			description: 'Path to directory of files to bump.',
			type: 'string',
		},
		{
			argument: 'help',
			alias: 'h',
			description: 'Log CLI usage text.',
			type: 'boolean',
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
			description: 'Log Release Bump version.',
			type: 'boolean',
		},
	]

	return args.reduce(
		(all: { [key: string]: any }, current: string, index: number) => {
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
				// One or more aliases.
			} else if (current.indexOf('-') === 0) {
				;[...current.substr(1)].forEach((alias) => {
					const cliOption = cliOptions.find(
						(cliOption) => cliOption.alias === alias,
					)
					if (cliOption) {
						modified[cliOption.argument] = true
					}
				})
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
		},
		{},
	)
}
