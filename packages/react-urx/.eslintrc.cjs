module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
  extends: ['eslint-config-standard-with-typescript', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    'symbol-description': ['off'],
    '@typescript-eslint/restrict-template-expressions': ['off'],
  },
}
