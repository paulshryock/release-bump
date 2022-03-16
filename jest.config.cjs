/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
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
