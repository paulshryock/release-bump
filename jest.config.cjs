/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	bail: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**', '!src/cli.ts'],
	coverageThreshold: {
		global: {
			statements: 95,
			branches: 83,
			functions: 100,
			lines: 95,
		},
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
			useESM: true,
		},
	},
	preset: 'ts-jest/presets/default-esm',
	resolver: 'jest-ts-webcompat-resolver',
	testEnvironment: 'node',
	transform: {},
}
