import { Stringable } from './Stringable'

/** @since unreleased */
export interface Configuration {
	dryRun: boolean
	prefix: boolean
	quiet: boolean
	release: string
	verbose: boolean
	write: boolean
}

/**
 * @since unreleased
 * @type {Configuration}
 */
export const DEFAULT_CONFIGURATION: Configuration = {
	dryRun: true,
	prefix: true,
	quiet: false,
	release: '',
	verbose: false,
	write: false,
}

/** @since unreleased */
export interface Configurator {
	/**
	 * Gets configuration.
	 *
	 * @since  unreleased
	 * @return {Promise<Configuration>}
	 */
	getConfiguration(): Promise<Configuration>
}

/**
 * Describes log levels.
 */
export enum LogLevel {
	EMERGENCY = 'emergency',
	ALERT = 'alert',
	CRITICAL = 'critical',
	ERROR = 'error',
	WARNING = 'warning',
	NOTICE = 'notice',
	INFO = 'info',
	DEBUG = 'debug',
}

type LevelLoggable = Record<
	LogLevel,
	(message: string | Stringable, context: any) => void
>

type Loggable = Record<
	'log',
	(level: LogLevel, message: string | Stringable, context: any) => void
>

/**
 * Describes a logger instance.
 *
 * The message MUST be a string or object implementing toString().
 *
 * The message MAY contain placeholders in the form: {foo} where foo will be
 * replaced by the context data in key "foo".
 *
 * The context array can contain arbitrary data, the only assumption that can
 * be made by implementors is that if an Error instance is given to produce a
 * stack trace, it MUST be in a key named "exception".
 *
 * @since unreleased
 * @see   https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
 * for the full interface specification.
 */
export interface Logger extends LevelLoggable, Loggable {}

/**
 * Describes a logger-aware instance.
 */
export interface LoggerAware {
	setLogger(logger: Logger): void
}

export interface FileSystem {
	listFiles(): Promise<string[]>
	readFile(path: string): Promise<string>
	writeFile(path: string, data: string): Promise<void>
}

export class FileSystemError extends Error {}

export interface Client {
	configurator?: Configurator
	fileSystem?: FileSystem
	logger?: Logger

	setConfigurator(configurator: Configurator): Client
	setFileSystem(fileSystem: FileSystem): Client
	setLogger(logger: Logger): Client

	bumpOne(path: string): Promise<void>
	bumpMany(): Promise<void>

	createChangelog(): Promise<void>
	bumpChangelog(): Promise<void>
	bumpWordPressTheme(): Promise<void>
	bumpWordPressPlugin(): Promise<void>
	bumpDocblocks(): Promise<void>
}
