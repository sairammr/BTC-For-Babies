// ESLint configuration for Next.js/React/TypeScript
import js from '@eslint/js';
import next from 'eslint-config-next';

export default [
  js(),
  ...next,
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Add or override rules here
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'off',
    },
  },
];
