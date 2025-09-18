const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['eslint.config.cjs', 'node_modules/**', 'img/**', 'files/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: { ...globals.browser },
    },
    rules: { "no-unused-vars": 'warn', "eqeqeq": 'error' },
  }
];
