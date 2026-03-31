import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier/recommended';
import github from 'eslint-plugin-github';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const custom = [
  {
    plugins: {
      'refined-prun': {
        rules: {
          // https://github.com/github/eslint-plugin-github/blob/main/docs/rules/array-foreach.md
          'array-foreach': github.rules['array-foreach'],
          // https://github.com/github/eslint-plugin-github/blob/main/docs/rules/no-innerText.md
          'no-innerText': github.rules['no-innerText'],
          // https://github.com/github/eslint-plugin-github/blob/main/docs/rules/no-then.md
          'no-then': github.rules['no-then'],
        },
      },
    },
    rules: {
      'refined-prun/array-foreach': 'error',
      'refined-prun/no-innerText': 'error',
      'refined-prun/no-then': 'error',
    },
  },
];

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
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowAny: true,
          allowNullableBoolean: true,
          allowNullableEnum: false,
          allowNullableNumber: false,
          allowNullableObject: true,
          allowNullableString: true,
          allowNumber: false,
          allowString: true,
        },
      ],
    },
  },

  // vue
  ...vue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-mutating-props': ['error', { shallowOnly: true }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.vue'],
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

  // custom
  custom,
  {
    rules: {
      curly: 'error',
      'capitalized-comments': [
        'error',
        'always',
        {
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      ],
      'no-inline-comments': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='reduce'][arguments.1.value=0]",
          message: 'Use sumBy() instead of .reduce() for summation.',
        },
      ],
    },
  },

  // other
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
      },
    },
  },

  {
    ignores: ['dist/**/*', 'eslint.config.mjs', 'src/types/unimport.d.ts'],
  },
);
