module.exports = {
  parserOptions: {
    'ecmaVersion': 2017,
  },
  env: {
    'node': true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  rules: {
    'no-console': 'off',
    'indent': [ 'error', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'never' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'no-multi-spaces': 'warn',
    'eol-last': ['error', 'always'],
    'indent': ['error', 2, {
      'SwitchCase': 1
    }],
    'node/exports-style': ['error', 'module.exports'],
  },
};
