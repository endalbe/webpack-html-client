module.exports = {
  ignorePatterns: [".eslintrc*", "*.config.js", "./config/*.js"],
  plugins: ["css-modules", "prettier"],
  extends: ["eslint:recommended", "plugin:css-modules/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
  },
};
