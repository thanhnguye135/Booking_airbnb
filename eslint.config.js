import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';

// Manually define __dirname in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      languageOptions: {
        parser: parser,
        parserOptions: {
          project: './tsconfig.json',
        },
      },
      plugins: {
        '@typescript-eslint': typescript,
        nestjs: 'eslint-plugin-nestjs',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'nestjs/no-async-methods': 'warn', // Example rule
      },
    },
  ],
  extends: [
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    'plugin:nestjs/recommended', // Use the plugin's recommended configuration
  ],
};
