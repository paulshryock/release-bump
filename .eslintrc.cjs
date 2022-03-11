module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'standard',
		'plugin:@typescript-eslint/recommended',
	],
	ignorePatterns: [
		'coverage',
		'dist',
		'node_modules',
		'tests',
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
				SwitchCase: 1,
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
				tabWidth: 2,
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
			{ anonymous: 'never', asyncArrow: 'always', named: 'never' },
		],
	},
}
