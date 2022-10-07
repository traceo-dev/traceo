module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'tailwind.config.js', 'app/dist/**', '*.ts'],
  rules: {
    // indent: [0],
    eqeqeq: ['error', 'always'],
    quotes: ['error', 'double'],
    semi: ['error', 'always'],
    camelcase: 0,
    'unused-imports/no-unused-imports-ts': 1,
    'object-curly-spacing': ['error', 'always'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    // 'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'require-jsdoc': 0,
    'comma-dangle': ['error', 'never'],
    'no-empty': 0,
    'operator-linebreak': 0,
    'quote-props': [2, 'as-needed'],
    // "require-await": "off",
    '@typescript-eslint/require-await': 'error',
    'no-return-await': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // "@typescript-eslint/no-unused-vars": [
    //   "error",
    //   { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
    // ],
  },
};
