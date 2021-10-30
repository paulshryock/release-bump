module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'standard',
		'plugin:@typescript-eslint/recommended',
		'plugin:ava/recommended',
	],
	ignorePatterns: [
		'build',
		'dist',
		'node_modules',
		'package-lock.json',
		'tsconfig.json',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'json-format'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'comma-dangle': ['error', 'always-multiline'],
		'guard-for-in': 'error',
		indent: [
			'error',
			'tab',
			{
				offsetTernaryExpressions: true,
			},
		],
		'max-len': [
			'error',
			{
				code: 80,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreUrls: true,
			},
		],
		'multiline-ternary': ['error', 'always-multiline'],
		'no-tabs': 'off',
		quotes: [
			'error',
			'single',
			{ allowTemplateLiterals: true, avoidEscape: true },
		],
		'space-before-function-paren': [
			'error',
			{ anonymous: 'always', asyncArrow: 'always', named: 'never' },
		],
	},
}
