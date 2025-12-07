// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const reactNative = require('eslint-plugin-react-native');
const tseslint = require('typescript-eslint');

// Shared settings across all configurations
const sharedSettings = {
  react: {
    version: 'detect',
  },
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
    },
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
};

// Shared rules across all configurations
const sharedRules = {
  // Prettier as an ESLint rule
  'prettier/prettier': ['error'],

  // React Native specific
  'react-native/no-inline-styles': 'warn',
  'react-native/no-unused-styles': 'warn',
  'react-native/sort-styles': 'off',

  // React rules
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',

  // Import rules
  'import/order': [
    'warn',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],
};

// Shared plugins across all configurations
const sharedPlugins = {
  'react-native': reactNative,
  prettier: prettierPlugin,
};

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: sharedPlugins,
    settings: sharedSettings,
    rules: {
      ...sharedRules,

      // TS rules – you can tighten these over time
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: sharedPlugins,
    settings: sharedSettings,
    rules: {
      ...sharedRules,

      // Disable TS-specific rules for JS files
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['node_modules', 'dist', 'build', '.expo', '.expo-shared', 'android', 'ios'],
  },
]);
