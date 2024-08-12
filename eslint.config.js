import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier/recommended';

export default ts.config(
  // js
  js.configs.recommended,

  // ts
  ...ts.configs.recommended,

  // vue
  ...vue.configs['flat/recommended'],
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
      globals: {
        chrome: 'readonly',
        PrunApi: 'readonly',
      },
    },
    ignores: ['eslint.config.js', 'browser-extension/manifest.js'],
  },
);
