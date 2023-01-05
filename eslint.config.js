import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import * as typescriptEslintParser from '@typescript-eslint/parser'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const {
	'eslint-recommended': {
		overrides: [{ rules: typescriptEslintEslintRecommended }],
	},
	recommended: { rules: typescriptEslintRecommended },
	'recommended-requiring-type-checking': {
		rules: typescriptEslintRecommendedRequiringTypeChecking,
	},
} = typescriptEslintPlugin.configs

export default [
	'eslint:recommended',
	{
		// env: { node: true },
		// extends: ['prettier'],
		ignores: ['**/.cache/**', '**/coverage/**'],
	},
	// {
	// files: ['./*.json}', '{bin,docs,src,tests}/**/*.json'],
	// extends: ['plugin:json/recommended', 'prettier'],
	// },
	// {
	// files: ['./*.ts', '{bin,docs,src,tests}/**/*.ts'],
	// extends: [
	// 	'plugin:@typescript-eslint/recommended',
	// 	'plugin:@typescript-eslint/recommended-requiring-type-checking',
	// 	'prettier',
	// ],
	// plugins: { typescriptEslintPlugin },
	// },
	{
		files: ['./*.ts', '{bin,docs,src,tests}/**/*.ts'],
		languageOptions: {
			parser: typescriptEslintParser,
			// parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 'latest',
				project: ['./tsconfig.json'],
				sourceType: 'module',
				tsconfigRootDir: __dirname,
			},
		},
		plugins: { '@typescript-eslint': typescriptEslintPlugin },
		rules: {
			...typescriptEslintEslintRecommended,
			...typescriptEslintRecommended,
			...typescriptEslintRecommendedRequiringTypeChecking,
			// '@typescript-eslint/no-explicit-any': 'off',
			// "@typescript-eslint/no-implicit-any-catch": ["error", { "allowExplicitAny": true }],
		},
	},
]

// export const legacy = {
// 	env: {
// 		browser: true,
// 		es2021: true,
// 		node: true,
// 	},
// 	extends: ['standard', 'plugin:@typescript-eslint/recommended'],
// 	ignorePatterns: [
// 		'coverage',
// 		'dist',
// 		'node_modules',
// 		'tests',
// 		'package-lock.json',
// 		'tsconfig.json',
// 	],
// 	parser: '@typescript-eslint/parser',
// 	parserOptions: {
// 		ecmaVersion: 13,
// 		sourceType: 'module',
// 	},
// 	plugins: ['@typescript-eslint', 'json-format'],
// 	rules: {
// 		'@typescript-eslint/no-explicit-any': 'off',
// 		'comma-dangle': ['error', 'always-multiline'],
// 		'guard-for-in': 'error',
// 		indent: [
// 			'error',
// 			'tab',
// 			{
// 				offsetTernaryExpressions: true,
// 				SwitchCase: 1,
// 			},
// 		],
// 		'max-len': [
// 			'error',
// 			{
// 				code: 80,
// 				ignoreRegExpLiterals: true,
// 				ignoreStrings: true,
// 				ignoreTemplateLiterals: true,
// 				ignoreUrls: true,
// 				tabWidth: 2,
// 			},
// 		],
// 		'multiline-ternary': ['error', 'always-multiline'],
// 		'no-tabs': 'off',
// 		quotes: [
// 			'error',
// 			'single',
// 			{ allowTemplateLiterals: true, avoidEscape: true },
// 		],
// 		'space-before-function-paren': [
// 			'error',
// 			{ anonymous: 'never', asyncArrow: 'always', named: 'never' },
// 		],
// 	},
// }
