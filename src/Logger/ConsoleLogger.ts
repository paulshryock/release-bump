import { Stringable } from '../Stringable'
import { Logger, LogLevel } from '../Client'

export enum ConsoleLogMethods {
	emergency = 'error',
	alert = 'error',
	critical = 'error',
	error = 'error',
	warning = 'warn',
	notice = 'log',
	info = 'info',
	debug = 'debug',
}

export class ConsoleLogger implements Logger {
	emergency(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.emergency](message, context)
	}

	alert(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.alert](message, context)
	}

	critical(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.critical](message, context)
	}

	error(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.error](message, context)
	}

	warning(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.warning](message, context)
	}

	notice(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.notice](message, context)
	}

	info(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.info](message, context)
	}

	debug(message: string|Stringable, context: any = {}): void {
		console[ConsoleLogMethods.debug](message, context)
	}

	log(level: LogLevel, message: string|Stringable, context: any = {}): void {
		this[level](message, context)
	}

	/**
	 * Interpolates context values into the message placeholders.
	 *
	 * @since  unreleased
	 * @param  {string|Stringable} message Message.
	 * @param  {any}               context Context.
	 * @return {string}
	 * @todo   implement
	 */
	// #interpolate(message: string|Stringable, context: any = {}): string {
	// 	;((m, c) => [m, c])(message, context)
	// 	return ''
	// }
}
