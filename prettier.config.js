export default {
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	overrides: [
		{
			files: [
				'*.{md,toml,yaml,yml}',
				'.{editorconfig,env,env.*,gitattributes,gitignore,npmrc,nvmrc}',
			],
			options: { useTabs: false },
		},
	],
	/*
	 * Do not set `printWidth`. Prettier’s print width is configured by
	 * `max_line_length` in `.editorconfig`.
	 */
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	semi: false,
	singleAttributePerLine: false,
	singleQuote: true,
	/*
	 * Do not set `tabWidth`. Prettier’s tab width is configured by `indent_size`
	 * or `tab_width` in `.editorconfig`.
	 *
	 * Since `.editorconfig` intentionally does not set `indent_size`, and does
	 * not set `root = true`, you can create your own `.editorconfig` _outside_
	 * this repo with `tab_width` set to whatever you want.
	 */
	trailingComma: 'all',
	useTabs: true,
}
