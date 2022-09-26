module.exports = {
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	jsxSingleQuote: true,
	/*
	 * Do not set `printWidth`: Setting `max_line_length` in an `.editorconfig`
	 * file will configure Prettier’s print width, unless overridden.
	 */
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	semi: false,
	singleAttributePerLine: false,
	singleQuote: true,
	/*
	 * Do not set `tabWidth`: Setting `indent_size` or `tab_width` in an
	 * `.editorconfig` file will configure Prettier’s tab width, unless
	 * overridden.
	 */
	trailingComma: 'all',
	useTabs: true,

	// File type overrides.
	overrides: [
		{
			files: [
				'*.{md,toml,yaml,yml}',
				'.{editorconfig,env,env.*,gitattributes,gitignore,npmrc,nvmrc}',
			],
			options: {
				useTabs: false,
			},
		},
	],
}
