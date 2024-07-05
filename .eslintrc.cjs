module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  ignorePatterns: ['.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./packages/web/tsconfig.json', './example/tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@stylistic/eslint-plugin-js', 'better-max-params'],
  rules: {
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['if', 'switch', 'while', 'function', 'multiline-const', 'try', 'for'],
        next: '*'
      },
      { blankLine: 'always', prev: '*', next: ['return'] },
    ],
    'space-before-blocks': [
      'error',
      {
        functions: 'always',
        keywords: 'always',
        classes: 'always',
      }
    ],
    curly: ['error', 'all'],
    'better-max-params/better-max-params': [
      'warn',
      {
        func: 3,
        constructor: 50,
      }
    ],
    'no-plusplus': ['off'],
    'no-restricted-syntax': ['off'],
    'no-bitwise': ['off'],
    'no-continue': 'off',
    'no-lonely-if': ['error'],
    'no-useless-return': ['warn'],
    'guard-for-in': 'off',
    'prefer-const': ['warn'],
    'prefer-destructuring': ['warn'],
    'prefer-object-spread': ['warn'],
    'prefer-spread': ['warn'],
    'no-trailing-spaces': ['warn'],
    'import/prefer-default-export': ['off'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        }
      }
    ],
    'max-lines': ['warn', 500],
    'max-len': ['warn', 150],
    '@typescript-eslint/no-use-before-define': 'off',
  }
}
