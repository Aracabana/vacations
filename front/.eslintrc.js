module.exports = {
  root: false,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/base',
    '@vue/standard',
    'standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}
