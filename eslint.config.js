import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import imports from 'eslint-plugin-import'
import storybook from 'eslint-plugin-storybook'

export default tseslint.config(
  {
    ignores: ['**/dist']
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      'import': imports
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'semi': ['error', 'never'],
      '@typescript-eslint/semi': 'off',
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single'],
      'quote-props': ['error', 'as-needed'],
      'import/extensions': ['error', 'never', { 'json': 'always', 'scss': 'always' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ]
    }
  },
  ...storybook.configs['flat/recommended']
)
