import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import imports from 'eslint-plugin-import'
import storybook from 'eslint-plugin-storybook'

export default tseslint.config(
  storybook.configs['flat/recommended'],
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  imports.flatConfigs.recommended,
  {
    name: 'react-git-log',
    files: ['packages/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'semi': ['error', 'never'],
      '@typescript-eslint/semi': 'off',
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single'],
      'quote-props': ['error', 'as-needed'],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
          svg: 'always',
          json: 'always',
          'scss': 'always'
        },
      ]
    },
    ignores: ['**/dist'],
    settings: {
      "import/resolver": {
        typescript: {
          noWarnOnMultipleProjects: true,
          project: [
            './packages/library/tsconfig.json',
            './packages/demo/tsconfig.json',
          ]
        }
      }
    }
  }
)
