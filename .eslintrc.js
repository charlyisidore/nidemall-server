module.exports = {
  extends: 'think',
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'eqeqeq': 'off',
    'no-console': 'warn',
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'yoda': ['error', 'always', { 'onlyEquality': true }],
  },
};
