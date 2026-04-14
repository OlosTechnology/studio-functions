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
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-console': 'warn',
      eqeqeq: ['warn', 'always'],
      curly: ['warn', 'multi-line'],
      'no-useless-concat': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-nested-ternary': 'warn',
      'object-shorthand': ['warn', 'always'],
      'no-param-reassign': 'warn',
      'default-case': 'warn',
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
