import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'no-param-reassign': 'off',
      'no-console': 'error',
      'class-methods-use-this': 'off',
      'react/require-default-props': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-no-constructed-context-values': 'off',
      'react/destructuring-assignment': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'next-env.d.ts',
    'next.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'prettier.config.js',
    'next-i18next.config.js',
    'config-overrides.js',
  ]),
]);

export default eslintConfig;
