import { ReleaseBumpOptions } from './index.js'
import { Console } from 'node:console'
import { createWriteStream, readFileSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

/** CLI argument. */
interface CliArgument {
	/** Alias. */
	alias?: string
	/** Description. */
	description: string
	/** Name. */
	name: string
	/** Type. */
	type: string
}

interface CliOptions extends ReleaseBumpOptions {
	/** Log CLI usage text. */
	help?: boolean
	/** Log Release Bump version. */
	version?: boolean
}

/** formatText options. */
export interface FormatTextOptions {
	/** Release date. */
	date: string
	/** Is changelog. */
	isChangelog: boolean
	/** Prefix release version with a 'v'. */
	prefix: boolean
	/** Quiet, no logs. */
	quiet: boolean
	/** Release version. */
	release: string
	/** Repository. */
	repository: string
}

/** getRecursiveFilePaths options. */
export interface GetRecursiveFilePathsOptions {
	/** Fail on error. */
	failOnError: boolean
	/** Path to files. */
	filesPath: string
	/** File paths. */
	paths: string[]
	/** Directories to ignore. */
	directoriesToIgnore: string[]
}

/** Logger options. */
interface LoggerOptions {
	/** Logs to /dev/null if quiet is true. */
	quiet: boolean
}

/** Package repository. */
interface PackageRepository {
	type?: string
	url?: string
}

/** process.env */
export interface ProcessEnv {
	[key: string]: string | undefined
}

/** Release Bump settings. */
interface ReleaseBumpSettings extends ReleaseBumpOptions {
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
 * Available CLI arguments.
 *
 * @todo Convert camelCase to kebab-case.
 */
export const availableArgs: CliArgument[] = [
	{
		description: 'Path to changelog.',
		name: 'changelogPath',
		type: 'string',
	},
	{
		description: 'Release date.',
		name: 'date',
		type: 'string',
	},
	{
		alias: 'd',
		description: 'Dry run.',
		name: 'dryRun',
		type: 'boolean',
	},
	{
		alias: 'e',
		description: 'Fail on error.',
		name: 'failOnError',
		type: 'boolean',
	},
	{
		description: 'Path to directory of files to bump.',
		name: 'filesPath',
		type: 'string',
	},
	{
		description: 'Directories to ignore.',
		name: 'ignore',
		type: 'string[]',
	},
	{
		alias: 'h',
		description: 'Log CLI usage text.',
		name: 'help',
		type: 'boolean',
	},
	{
		alias: 'p',
		description: "Prefix release version with a 'v'.",
		name: 'prefix',
		type: 'boolean',
	},
	{
		alias: 'q',
		description: 'Quiet, no logs.',
		name: 'quiet',
		type: 'boolean',
	},
	{
		description: 'Release version.',
		name: 'release',
		type: 'string',
	},
	{
		description: 'Remote git repository URL.',
		name: 'repository',
		type: 'string',
	},
	{
		alias: 'v',
		description: 'Log Release Bump version.',
		name: 'version',
		type: 'boolean',
	},
]

/**
 * Filters file paths.
 *
 * @since  3.0.0
 * @param  {string[]} filePaths           File paths.
 * @param  {string[]} directoriesToIgnore Directories to ignore.
 * @return {string[]}                     Filtered file paths.
 */
export function filterFilePaths(
	filePaths: string[],
	directoriesToIgnore: string[],
): string[] {
	return filePaths.filter(
		(file) =>
			!directoriesToIgnore.some((directory) => file.includes(directory)),
	)
}

/**
 * Flattens an array of strings.
 *
 * @since  unreleased
 * @param  {(string | string[])[]} items Items.
 * @return {string[]}
 */
function flattenArrayOfStrings(items: (string | string[])[]): string[] {
	const flat: string[] = []

	items.forEach((item) => {
		if (Array.isArray(item)) {
			flat.push(...flattenArrayOfStrings(item))
		} else {
			flat.push(item)
		}
	})

	return flat
}

/**
 * Formats repository URL.
 *
 * @since  3.0.0
 * @param  {string|PackageRepository} repository Repository.
 * @return {string}                              Formatted repository URL.
 */
export function formatRepositoryUrl(
	repository: string | PackageRepository,
): string {
	if (typeof repository === 'string') {
		if (
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
				repository,
			)
		) {
			return repository
		}

		if (
			/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(
				repository,
			)
		) {
			return `https://github.com/${repository}`
		}
	} else {
		if (typeof repository?.url === 'undefined') return ''
		return formatRepositoryUrl(repository.url.replace(/(^git\+|\.git$)/, ''))
	}

	return ''
}

/**
 * Formats text.
 *
 * @since  3.0.0
 * @param  {string}            unformatted Unformatted text.
 * @param  {FormatTextOptions} options     Options.
 * @return {string}                        Formatted text.
 */
export async function formatText(
	unformatted: string,
	options: FormatTextOptions,
): Promise<string> {
	const { date, isChangelog, prefix, quiet, release, repository } = options

	/** Is pre-release.  */
	const isPrerelease = !/^\d+\.\d+\.\d+$/.test(release)

	if (isPrerelease) {
		return unformatted
	}

	/** Semantic release version. */
	const version = /\d+\.\d+\.\d+/.exec(release)?.[0] ?? release

	if (isChangelog === false) {
		return unformatted.replace(
			/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,
			`@$1$2${version}`,
		)
	}

	/** Git remote. */
	const remote = repository.includes('bitbucket.org') ? 'bitbucket' : 'github'

	/** Release URL. */
	const releaseUrl = `${repository}/${
		remote === 'bitbucket' ? 'commits' : 'releases'
	}/tag/${prefix ? 'v' : ''}${version}`

	/** Header. */
	const header =
		`## [${prefix ? 'v' : ''}${version}]` +
		(repository !== '' ? `(${releaseUrl})` : '') +
		(date ? ` - ${date}` : '')

	/** Logger. */
	const logger = Logger({ quiet })

	if (unformatted.includes(header)) {
		logger.info('changelog is already formatted')
		return unformatted
	}

	/** Compare URL. */
	const compareUrl = `(${repository}/${
		remote === 'bitbucket' ? 'branches/' : ''
	}compare/HEAD..${prefix ? 'v' : ''}${version})`

	/** Unreleased. */
	const unreleased =
		`## [Unreleased]${repository ? compareUrl : ''}\n\n### ` +
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
 * Gets help text.
 *
 * @since  3.0.0
 * @param  {CliArgument[]} availableArgs Available arguments.
 * @return {string}                      Help text.
 * @todo                                 Add examples.
 */
export function getHelpText(availableArgs: CliArgument[]): string {
	return [
		'Usage\n	$ release-bump <options>',
		'Options' +
			availableArgs.reduce((output, current) => {
				const alias = current.alias
					? (current.name.length < 6 ? '	' : '') + `	-${current.alias}`
					: `		`
				const description = current.alias
					? `	${current.description}`
					: (current.name.length < 6 ? '	' : '') + current.description
				return output + `\n	--${current.name}${alias}${description}`
			}, ''),
		'Examples\n	$ release-bump -pq --files=src',
	].join('\n\n')
}

/**
 * Gets all unique file paths in a directory recursively.
 *
 * @since  3.0.0
 * @param  {GetRecursiveFilePathsOptions} options Options.
 * @return {Promise<string[]>}                    Recursive file paths.
 */
export async function getRecursiveFilePaths(
	options: GetRecursiveFilePathsOptions,
): Promise<string[]> {
	const { directoriesToIgnore, failOnError, filesPath, paths } = options

	if (
		directoriesToIgnore.some((directoryToIgnore) => {
			return filesPath.includes(directoryToIgnore)
		})
	) {
		return paths ?? []
	}

	/** Files in files path. */
	let filesInFilesPath: string[] = []

	try {
		filesInFilesPath = await readdir(filesPath)
	} catch (error: any) {
		if (failOnError) {
			process.exitCode = 1
			throw error
		} else {
			filesInFilesPath = []
		}
	}

	/** New paths. */
	const newPaths: (string | string[])[] = await Promise.all(
		filesInFilesPath.map(async (filePath) => {
			const newPath = await stat(`${filesPath}/${filePath}`)
			const isDirectory = newPath.isDirectory() === true
			if (isDirectory) {
				return await getRecursiveFilePaths({
					directoriesToIgnore,
					failOnError,
					filesPath: `${filesPath}/${filePath}`,
					paths,
				})
			}

			return join(`${filesPath}/${filePath}`)
		}),
	)

	return [...new Set(flattenArrayOfStrings([...paths, ...newPaths]))]
}

/**
 * Gets version text.
 *
 * @since  3.0.0
 * @param  {ProcessEnv} env process.env.
 * @return {string}         Release Bump version.
 */
export function getVersionText(env: ProcessEnv): string {
	return env?.RELEASE_BUMP_VERSION
		? 'v' + env.RELEASE_BUMP_VERSION
		: 'no version found'
}

/**
 * Returns a Console object which either writes to the console or /dev/null.
 *
 * @since  unreleased
 * @param  {LoggerOptions} options Logger options.
 * @return {Console}               Console object.
 */
export function Logger({ quiet }: LoggerOptions): Console {
	if (quiet === true) {
		return new Console({
			stdout: createWriteStream('/dev/null'),
			stderr: createWriteStream('/dev/null'),
		})
	} else {
		return console
	}
}

/**
 * Parses CLI options from arguments.
 *
 * @since  3.0.0
 * @param  {string[]}   passedArgs    Passed CLI arguments.
 * @param  {string[]}   availableArgs Available CLI arguments.
 * @return {CliOptions}               Parsed CLI options.
 */
export function parseOptionsFromArgs(
	passedArgs: string[],
	availableArgs: CliArgument[],
): CliOptions {
	return passedArgs.reduce(
		(all: { [key: string]: any }, current: string, index: number) => {
			const modified: { [key: string]: any } = {}

			// Argument.
			if (current.indexOf('--') === 0) {
				const [key, value] = current.substr(2).split('=')
				const arg = availableArgs.find(
					(availableArg) => availableArg.name === key,
				)
				if (arg) {
					switch (arg.type) {
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
					const arg = availableArgs.find(
						(availableArg) => availableArg.alias === alias,
					)
					if (arg) {
						modified[arg.name] = true
					}
				})
				// Value.
			} else {
				const keys = Object.keys(all)
				const key = keys[keys.length - 1]
				const arg = availableArgs.find(
					(availableArg) => availableArg.name === key,
				)
				if (
					arg &&
					(all[key] === `$${index - 1}` || typeof all[key] === 'undefined')
				) {
					modified[key] = arg.type === 'string[]' ? current.split(',') : current
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
 * @since  3.0.0
 * @param  {ReleaseBumpOptions}  options Release Bump options.
 * @return {ReleaseBumpSettings}         Release Bump settings.
 */
export function parseSettingsFromOptions(
	options: ReleaseBumpOptions,
): ReleaseBumpSettings {
	/** Parsed package.json content. */
	let pkg = { repository: '', version: '0.0.0' }

	/** Quiet default value. */
	const quietDefault = process.env.NODE_ENV === 'test' || false

	/** Logger. */
	const logger = Logger({
		quiet: options.quiet ?? quietDefault,
	})

	try {
		pkg = JSON.parse(readFileSync('package.json', 'utf8'))
	} catch (error: any) {
		logger.warn('could not read package.json')
	}

	/** Directories to ignore. */
	const ignore = [
		'.git',
		'.github',
		'coverage',
		'dist',
		'node_modules',
		'tests/fixtures',
	]

	/** Release Bump defaults. */
	const defaults: ReleaseBumpSettings = {
		changelogPath: 'CHANGELOG.md',
		date: new Date().toISOString().split('T')?.[0],
		dryRun: false,
		failOnError: false,
		filesPath: '.',
		ignore,
		prefix: false,
		quiet: quietDefault,
		release: pkg.version,
		repository: formatRepositoryUrl(pkg.repository),
	}

	/** Release Bump settings. */
	const settings = { ...defaults, ...options }

	return settings
}
