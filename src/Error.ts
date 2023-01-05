/**
 * Checks if an unknown error is an ErrnoException.
 *
 * @since  unreleased
 * @param  {unknown}                        error Unknown error.
 * @return {error is NodeJS.ErrnoException}       Error is an ErrnoException.
 */
export function isErrnoException(
	error: unknown,
): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error
}
