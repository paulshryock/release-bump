/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	bail: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**', '!src/cli.ts'],
	coverageThreshold: {
		global: {
			statements: 89,
			branches: 76,
			functions: 100,
			lines: 89,
		},
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts', '.cts'],
	preset: 'ts-jest/presets/default-esm',
	resolver: 'jest-ts-webcompat-resolver',
	testEnvironment: 'node',
	transform: {
		'/*(.(test|spec))?.[mc]?ts/': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
				useESM: true,
			},
		],
	},
}
