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
export interface Logger {
	/**
	 * System is unusable.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	emergency: (message: string|Stringable, context: any) => void

	/**
	 * Action must be taken immediately.
	 *
	 * Example: Entire website down, database unavailable, etc. This should
	 * trigger the SMS alerts and wake you up.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	alert: (message: string|Stringable, context: any) => void

	/**
	 * Critical conditions.
	 *
	 * Example: Application component unavailable, unexpected exception.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	critical: (message: string|Stringable, context: any) => void

	/**
	 * Runtime errors that do not require immediate action but should typically
	 * be logged and monitored.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	error: (message: string|Stringable, context: any) => void

	/**
	 * Exceptional occurrences that are not errors.
	 *
	 * Example: Use of deprecated APIs, poor use of an API, undesirable things
	 * that are not necessarily wrong.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	warning: (message: string|Stringable, context: any) => void

	/**
	 * Normal but significant events.
	 *
	 * Example: Use of deprecated APIs, poor use of an API, undesirable things
	 * that are not necessarily wrong.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	notice: (message: string|Stringable, context: any) => void

	/**
	 * Interesting events.
	 *
	 * Example: User logs in, SQL logs.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	info: (message: string|Stringable, context: any) => void

	/**
	 * Detailed debug information.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	debug: (message: string|Stringable, context: any) => void

	/**
	 * Logs with an arbitrary level.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return void
	 */
	log: (level: LogLevel, message: string, context: any) => void
}

export class ConsoleLogger implements Logger {
	emergency(message: string|Stringable, context: any): void {}
	alert(message: string|Stringable, context: any): void {}
	critical(message: string|Stringable, context: any): void {}
	error(message: string|Stringable, context: any): void {}
	warning(message: string|Stringable, context: any): void {}
	notice(message: string|Stringable, context: any): void {}
	info(message: string|Stringable, context: any): void {}
	debug(message: string|Stringable, context: any): void {}

	log(level: LogLevel, message: string|Stringable, context: any): void {
		this[level](message, context)
	}
}

/**
 * Describes a logger-aware instance.
 */
export interface LoggerAware
{
  /**
   * Sets a logger instance on the object.
   *
   * @since  unreleased
   *
   * @param  {Logger} logger Logger instance.
   * @return {void}
   */
  setLogger(logger: Logger): void
}

/**
 * Describes log levels.
 */
enum LogLevel {
	EMERGENCY = 'emergency',
	ALERT = 'alert',
	CRITICAL = 'critical',
	ERROR = 'error',
	WARNING = 'warning',
	NOTICE = 'notice',
	INFO = 'info',
	DEBUG = 'debug',
}

export interface Stringable {
	toString: () => string
}

/**
 * Interpolates context values into the message placeholders.
 *
 * @since unreleased
 * @param {string|Stringable} message Message.
 * @param {any}               context Context.
 */
function interpolate(message: string|Stringable, context: any = {}) {}
