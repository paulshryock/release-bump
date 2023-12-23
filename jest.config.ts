import type { Config } from 'jest'

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['bin/**/*', 'src/**/*'],
	coverageDirectory: 'coverage',
	coverageProvider: 'babel',
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
		'src/index.ts': {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	errorOnDeprecated: true,
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
}

export default config
