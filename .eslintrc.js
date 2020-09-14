module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'prettier',
    'plugin:vue/recommended'
  ],
  plugins: [
    'prettier',
    'vue'
  ],
  rules: {
    'no-unused-vars': 'warn',
  },
  parserOptions: {
    sourceType: "module"
  }
};
