export default {
  bail: true,
  cacheDirectory: '.cache/jest',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**', '!src/cli.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.test.ts'],
  preset: 'ts-jest/presets/default-esm',
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: 'node',
  transform: {
    '/*(.(test))?.ts/': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
}
