import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import globals from 'globals'

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next',
    'dist',
    'out',
    'build',
    'public/aclib-anti-adblock.js',
    'public/spa-loader.js',
    'scripts/**',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['app/api/**/*.js', 'src/data/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
])