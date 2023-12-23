import { Changelog, DEFAULT_CHANGELOG } from '../src/Changelog.ts'
import { describe, expect, it } from '@jest/globals'

describe('Changelog', () => {
	it('should return the default changelog if one is not provided', () => {
		expect(new Changelog().toString()).toBe(DEFAULT_CHANGELOG)
	})

	it('should return the changelog as-is if no version is provided', () => {
		expect(new Changelog('some changelog text').toString()).toBe(
			'some changelog text',
		)
	})

	it('should return the modified changelog if a version is provided', () => {
		const changelog = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed
- Bump docblock comments via git, semver, and sed.

### Deprecated

### Removed

### Fixed

### Security

## [2.2.1] - 2021-07-29

### Changed
- Update file util methods.
- Update test coverage.
`
		const version = '3.0.0'

		const date = new Date('2023/12/22')

		const expected = `# Changelog
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

## [3.0.0] - 2023-12-22

### Changed
- Bump docblock comments via git, semver, and sed.

## [2.2.1] - 2021-07-29

### Changed
- Update file util methods.
- Update test coverage.
`

		expect(new Changelog(changelog, version, date).toString()).toBe(expected)
	})
})
