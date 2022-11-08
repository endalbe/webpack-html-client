const ESLintPlugin = require("eslint-webpack-plugin");

const options = {
  fix: true,
  extensions: ["*.js", "*.scss", "*.css"],
  exclude: ['node_modules', 'configs/**.js']
};

module.exports = new ESLintPlugin(options);
