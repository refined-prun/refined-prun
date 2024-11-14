import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier/recommended';

export default ts.config(
  // js
  js.configs.recommended,

  // ts
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts,vue}'],
    rules: {
      // This check is already provided by TypeScript.
      'no-undef': 'off',
    },
  },

  // vue
  ...vue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': ['error', { shallowOnly: true }],
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },

  // prettier
  prettier,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // other
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },

  {
    ignores: ['dist/**/*', 'src/types/unimport.d.ts'],
  },
);
