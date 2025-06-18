export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // Basic rules that work without additional plugins
      'no-unused-vars': 'warn',
      'no-console': 'off', // We use console.log for CLI output
      'prefer-const': 'error',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }]
    }
  },
  {
    // Ignore build outputs and node_modules
    ignores: [
      'dist/**/*',
      'build/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      '*.d.ts',
      'packages/*/dist/**/*',
      'packages/*/build/**/*'
    ]
  }
]; 