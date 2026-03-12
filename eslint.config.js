import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^[A-Z_]|React|motion',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      // Context files intentionally export both component and hook — not a real issue
      'react-refresh/only-export-components': 'warn',
      // Math.random() inside useMemo during initialization is intentional (star positions)
      'react-hooks/purity': 'off',
      // Guarded setState in effects is intentional in this codebase
      'react-hooks/set-state-in-effect': 'off',
      // Memoization preservation warnings are cosmetic only
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
])

