import { ReleaseBumpOptions } from './index.js'
import { readFileSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// todo: Implement custom logger.

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

/** formatChangelogText options. */
export interface FormatChangelogTextOptions {
	/** Release date. */
	date: string
	/** Prefix release version with a 'v'. */
	prefix: boolean
	/** Release version. */
	release: string
	/** Remote git repository URL. */
	repository: string
}

/** formatDocblock options. */
export interface FormatDocblockOptions {
	/** Release version. */
	release: string
}

/**
 * CLI options.
 *
 * @todo Convert camelCase to kebab-case.
 */
export const cliOptions = [
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
		argument: 'ignore',
		description: 'Directories to ignore.',
		type: 'string[]',
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

/**
 * Filters file paths.
 *
 * @since  3.0.0
 * @param  {string[]} filePaths           File paths.
 * @param  {string[]} directoriesToIgnore Directory paths to ignore.
 * @return {string[]}                     Filtered file paths.
 */
export function filterFiles(
	filePaths: string[],
	directoriesToIgnore: string[],
): string[] {
	return filePaths.filter(
		(file) =>
			!directoriesToIgnore.some((directory) => file.includes(directory)),
	)
}

/**
 * Formats changelog text.
 *
 * @since  3.0.0
 * @param  {string}                     unformatted Unformatted text.
 * @param  {FormatChangelogTextOptions} options     Options.
 * @return {string}                                 Formatted text.
 */
export function formatChangelogText(
	unformatted: string,
	options: FormatChangelogTextOptions,
): string {
	const { date, prefix, release, repository } = options
	/** Git remote. */
	const remote = repository.includes('bitbucket.org') ? 'bitbucket' : 'github'

	/** Semantic release version. */
	const version = /\d+\.\d+\.\d+/.exec(release)?.[0] ?? release

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
		`## [Unreleased]${repository ? unreleasedDiffUrl : ''}\n\n### ` +
		['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(
			'\n\n### ',
		)

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

/**
 * Formats Docblock.
 *
 * @since  3.0.0
 * @param  {string}                unformatted Unformatted text.
 * @param  {FormatDocblockOptions} options     Options.
 * @return {string}                            Formatted text.
 */
export function formatDocblock(
	unformatted: string,
	options: FormatDocblockOptions,
): string {
	const { release } = options

	/** Semantic release version. */
	const version = /\d+\.\d+\.\d+/.exec(release)?.[0] ?? release

	return unformatted.replace(
		/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
		`@$1$2${version}`,
	)
}

/**
 * Formats git repository URL.
 *
 * @since  3.0.0
 * @param  {string}               repository Unformatted git repository URL.
 * @param  {'bitbucket'|'github'} remote     (optional) Git remote.
 * @return {string}                          Formatted git repository URL.
 */
export function formatRepositoryUrl(
	repository: string,
	remote: 'bitbucket' | 'github' = 'github',
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
		const origin = remote === 'bitbucket' ? 'bitbucket.org' : 'github.com'
		return `https://${origin}/${repository}`
	}

	return ''
}

/**
 * Gets help text.
 *
 * @since  3.0.0
 * @return {string} Help text.
 * @todo            Add examples.
 */
export function getHelpText(): string {
	return (
		'\nUsage\n	$ release-bump <options>\n\nOptions' +
		cliOptions.reduce((output, current) => {
			const alias = current.alias
				? (current.argument.length < 6 ? '	' : '') + `	-${current.alias}`
				: `		`
			const description = current.alias
				? `	${current.description}`
				: (current.argument.length < 6 ? '	' : '') + current.description
			return output + `\n	--${current.argument}${alias}${description}`
		}, '') +
		'\n\nExamples\n	$ release-bump -pq --files=src\n'
	)
}

/**
 * Gets all file paths in a directory recursively.
 *
 * @since  3.0.0
 * @param  {string}            dir      Directory of files.
 * @param  {string[]}          paths=[] File paths.
 * @return {Promise<string[]>}          Recursive file paths.
 */
export async function getRecursiveFilePaths(
	dir: string,
	paths: string[] = [],
): Promise<string[]> {
	(await readdir(dir)).forEach(async (file) => {
		if ((await stat(dir + '/' + file)).isDirectory()) {
			paths = await getRecursiveFilePaths(`${dir}/${file}`, paths)
		} else {
			if (typeof paths !== 'undefined') {
				paths.push(join(dir, '/', file))
			}
		}
	})

	return paths
}

/**
 * Gets version text.
 *
 * @since  3.0.0
 * @return {Promise<string>} Release Bump version.
 */
export async function getVersionText(): Promise<string> {
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
					switch (cliOption.type) {
						case 'boolean':
							modified[key] = true
							break
						case 'string[]':
							modified[key] = value?.split(',')
							break
						default:
							modified[key] = value
							break
					}
				}
				// One or more aliases.
			} else if (current.indexOf('-') === 0) {
				[...current.substr(1)].forEach((alias) => {
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
				const cliOption = cliOptions.find(
					(cliOption) => cliOption.argument === key,
				)
				if (
					cliOption &&
					(all[key] === `$${index - 1}` || typeof all[key] === 'undefined')
				) {
					modified[key] =
						cliOption.type === 'string[]' ? current.split(',') : current
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

/**
 * Parses settings from options.
 *
 * @since  unreleased
 * @param  {ReleaseBumpOptions}  options Release Bump options.
 * @return {ReleaseBumpSettings}         Release Bump settings.
 */
export function parseSettingsFromOptions(
	options: ReleaseBumpOptions,
): ReleaseBumpSettings {
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

	/** Release Bump settings. */
	const settings = { ...defaults, ...options }

	return settings
}
