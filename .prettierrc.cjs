module.exports = {
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	vueIndentScriptAndStyle: false,

	overrides: [
		{
			files: '*.{json,md,txt,yaml,yml}',
			options: {
				printWidth: 120,
				useTabs: false,
			},
		},
		{
			files: '.{editorconfig,gitignore}',
			options: {
				useTabs: false,
			},
		},
	],
}
