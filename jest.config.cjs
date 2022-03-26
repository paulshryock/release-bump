/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**', '!src/cli.ts'],
	coverageThreshold: {
		global: {
			branches: 71,
			functions: 100,
			lines: 87,
			statements: 86,
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
