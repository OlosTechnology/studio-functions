import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import studio from './config/eslint-plugin-studio.js';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier,
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
      'no-useless-concat': 'error',
      'no-unneeded-ternary': 'error',
      'no-nested-ternary': 'error',
      'object-shorthand': ['warn', 'always'],
      'no-param-reassign': 'warn',
      'default-case': 'warn',
      camelcase: ['warn', { properties: 'never' }],
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'prefer-destructuring': ['warn', { object: true, array: false }],
    },
  },
  {
    files: ['functions/**/*.js'],
    plugins: {
      studio,
    },
    processor: 'studio/studio',
  },
];
