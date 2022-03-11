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
			files: '*.{json,md,swcrc,txt,yaml,yml,xml}',
			options: {
				printWidth: 120,
				useTabs: false,
			},
		},
		{
			files: '.{editorconfig,env,env.*,gitattributes,gitignore,nvmrc}',
			options: {
				useTabs: false,
			},
		},
	],
}
