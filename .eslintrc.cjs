module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'standard',
  ignorePatterns: [
    '.github',
    'coverage',
    'dist',
  ],
  /**
   * @see:  https://github.com/tc39/proposal-private-methods
   * @see:  https://tc39.es/proposal-private-methods/
   * @todo: Remove @babel/eslint-parser when private methods reaches Stage 4.
   *        - Remove `parser: '@babel/eslint-parser',`
   *        - Remove `requireConfigFile: false,`
   *        - `npm uninstall -D @babel/eslint-parser`
   */
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2, { offsetTernaryExpressions: true }],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { ignoreTemplateLiterals: true, ignoreStrings: true }],
    'multiline-ternary': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
