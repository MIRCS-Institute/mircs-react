module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'jest': true,
  },
  'parser': 'babel-eslint',
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    },
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'sort-imports-es6-autofix'
  ],
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  'rules': {
    'max-lines': ['error', {'max': 500, 'skipBlankLines': true}],
    'jsx-quotes': ['warn', 'prefer-single'],
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
    'sort-imports-es6-autofix/sort-imports-es6': [ 'warn', {
      ignoreCase: true,
      memberSyntaxSortOrder: ['all', 'multiple', 'single', 'none']
    }],
    'react/display-name': 'off',
    'react/prop-types': [ 'error', {
      ignore: [
        'children',
        'classes',
      ],
  }],
    'react/no-unescaped-entities': ['error', {'forbid': [ '>', '}' ]}],
  }
}
