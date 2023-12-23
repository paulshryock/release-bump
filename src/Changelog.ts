/** @since unreleased */
export const DEFAULT_CHANGELOG = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
`

/**
 * Creates a new changelog.
 *
 * @alpha
 * @since unreleased
 */
export class Changelog {
	#content: string

	/**
	 * Constructs a new Changelog instance.
	 *
	 * @param {string} content Previous changelog content.
	 * @param {string} version New version.
	 * @param {Date}   date    Date of new version.
	 * @alpha
	 * @since unreleased
	 */
	public constructor(
		content: string = DEFAULT_CHANGELOG,
		version: string = 'Unreleased',
		date: Date = new Date(),
	) {
		this.#content =
			version === 'Unreleased'
				? content
				: this.#bump(content, version, this.#formatDate(date))
	}

	/**
	 * Returns the changelog content.
	 *
	 * @return {string} Changelog content.
	 * @alpha
	 * @since unreleased
	 */
	public toString(): string {
		return this.#content
	}

	/**
	 * Bumps changelog content.
	 *
	 * @internal
	 * @param  {string} content Previous content of changelog.
	 * @param  {string} version Version of new release.
	 * @param  {string} date    Date of new release.
	 * @return {string}         Modified changelog content.
	 * @since unreleased
	 */
	#bump(content: string, version: string, date: string): string {
		return content
			.replaceAll(/### [A-Z][a-z]+\n{2,}(?!-)/gu, '')
			.replace(
				/## \[Unreleased\]/u,
				`## [Unreleased]\n\n### Added\n\n### Changed\n\n### Deprecated\n\n### Removed\n\n### Fixed\n\n### Security\n\n## [${version}] - ${date}`,
			)
	}

	/**
	 * Formats a Date object as a YYYY-MM-DD string.
	 *
	 * @internal
	 * @param  {Date}   date Date object to format.
	 * @return {string}      YYYY-MM-DD string.
	 * @since unreleased
	 */
	#formatDate(date: Date): string {
		const [month, day, year] = date
			.toLocaleString('en-US', {
				day: '2-digit',
				month: '2-digit',
				timeZone: 'utc',
				year: 'numeric',
			})
			.split('/')

		return [year, month, day].join('-')
	}
}
