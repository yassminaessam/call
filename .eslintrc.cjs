/* ESLint configuration with custom i18n rule stub */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'i18n/no-hardcoded-ui-text': ['warn', { minLength: 3 }]
  },
  settings: {},
  ignorePatterns: ['dist', 'node_modules'] ,
  // Custom rule injection
  // We map the rule name space to our local rule file via override mechanism using ESLint's resolver hook via plugin style simulation.
  // Simpler approach: require the rule file directly here and assign into linter after load.
  // Because we are not publishing a plugin, we can dynamically patch in a "processor".
  overrides: [
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      plugins: ['local-i18n'],
      // We'll inject rule implementation via 'defineConfig' hack in build scripts later; placeholder for clarity.
    }
  ]
};
