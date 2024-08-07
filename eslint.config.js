import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintReactPlugin from 'eslint-plugin-react';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';

let preactConfig = tsEslint.config(
  {
    plugins: {
      react: {
        rules: eslintReactPlugin.rules,
      },
      'react-hooks': eslintReactHooksPlugin,
    },
    rules: {
      ...eslintReactPlugin.configs.recommended.rules,
      ...eslintReactHooksPlugin.configs.recommended.rules,
    },
    languageOptions: { parserOptions: eslintReactPlugin.configs.recommended.parserOptions },
  },
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    settings: {
      react: {
        // eslint-plugin-preact interprets this as "h.createElement",
        // however we only care about marking h() as being a used variable.
        pragma: 'h',
        // We use "react 16.0" to avoid pushing folks to UNSAFE_ methods.
        version: '16.0',
      },
    },

    rules: {
      /**
       * Preact / JSX rules
       */
      'react/no-deprecated': 2,
      'react/react-in-jsx-scope': 0, // handled this automatically
      'react/display-name': [1, { ignoreTranspilerName: false }],
      'react/jsx-no-bind': [
        1,
        {
          ignoreRefs: true,
          allowFunctions: true,
          allowArrowFunctions: true,
        },
      ],
      'react/jsx-no-comment-textnodes': 2,
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-no-target-blank': 2,
      'react/jsx-no-undef': 2,
      'react/jsx-tag-spacing': [2, { beforeSelfClosing: 'always' }],
      'react/jsx-uses-react': 2, // debatable
      'react/jsx-uses-vars': 2,
      'react/jsx-key': [2, { checkFragmentShorthand: true }],
      'react/self-closing-comp': 2,
      'react/prefer-es6-class': 2,
      'react/prefer-stateless-function': 1,
      'react/require-render-return': 2,
      'react/no-danger': 1,
      'react/no-unknown-property': [2, { ignore: ['class'] }],
      // Legacy APIs not supported in Preact:
      'react/no-did-mount-set-state': 2,
      'react/no-did-update-set-state': 2,
      'react/no-find-dom-node': 2,
      'react/no-is-mounted': 2,
      'react/no-string-refs': 2,

      /**
       * Hooks
       */
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 1,

      /**
       * General JavaScript error avoidance
       */
      'constructor-super': 2,
      'no-caller': 2,
      'no-const-assign': 2,
      'no-delete-var': 2,
      'no-dupe-class-members': 2,
      'no-dupe-keys': 2,
      'no-duplicate-imports': 2,
      'no-else-return': 1,
      'no-empty-pattern': 0,
      'no-empty': 0,
      'no-extra-parens': 0,
      'no-iterator': 2,
      'no-lonely-if': 2,
      'no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
      'no-multi-str': 1,
      'no-new-wrappers': 2,
      'no-proto': 2,
      'no-redeclare': 2,
      'no-shadow-restricted-names': 2,
      'no-shadow': 0,
      'no-spaced-func': 2,
      'no-this-before-super': 2,
      'no-undef-init': 2,
      'no-unneeded-ternary': 2,
      'no-unused-vars': [
        2,
        {
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'no-useless-call': 1,
      'no-useless-computed-key': 1,
      'no-useless-concat': 1,
      'no-useless-constructor': 1,
      'no-useless-escape': 1,
      'no-useless-rename': 1,
      'no-var': 1,
      'no-with': 2,

      /**
       * General JavaScript stylistic rules (disabled)
       */
      semi: 0,
      strict: [2, 'never'], // assume type=module output (cli default)
      'object-curly-spacing': [0, 'always'],
      'rest-spread-spacing': 0,
      'space-before-function-paren': [0, 'always'],
      'space-in-parens': [0, 'never'],
      'object-shorthand': 1,
      'prefer-arrow-callback': 1,
      'prefer-rest-params': 1,
      'prefer-spread': 1,
      'prefer-template': 1,
      quotes: [
        0,
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'quote-props': [2, 'as-needed'],
      radix: 1, // parseInt(x, 10)
      'unicode-bom': 2,
      'valid-jsdoc': 0,
    },
  },
);

export default tsEslint.config(
  eslint.configs.recommended,
  ...preactConfig,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        jsxPragma: 'h',
        project: true,
      },
      globals: {
        chrome: 'readonly',
      },
    },
    ignores: ['eslint.config.js', 'babel.config.js', 'browser-extension/manifest.js'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
);