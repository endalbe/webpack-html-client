const PrettierPlugin = require("prettier-webpack-plugin");

module.exports = new PrettierPlugin({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
});
