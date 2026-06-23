import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    name: 'p31/bonding/prettier',
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': 'warn',
    },
  },
  {
    name: 'p31/bonding/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.wrangler/**',
      '**/*.config.*',
      '**/*.test.*',
      '**/*.spec.*',
      '**/__tests__/**',
      '**/android/**',
      '**/ios/**',
    ],
  },
  {
    name: 'p31/bonding/typescript',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
