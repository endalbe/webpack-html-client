require("dotenv").config();

const HtmlWebpackPlugin = require("html-webpack-plugin");
const pages = require("./pages.json");

const defaultOptions = {
  faviconPath: "assets/icons/favicon.png",
  title: process.env.APP_TITLE || "",
  showDefaultTitle: true,
  minifyHtml: false,
  chunks: "app",
  filename: "index.html",
};

function getTitle(title = "", hasDefaultTitle = false) {
  console.log(hasDefaultTitle);
  return (
    (hasDefaultTitle ? defaultOptions.title : "") +
      (hasDefaultTitle && title && defaultOptions.title ? " - " : "") +
      title || ""
  );
}

let templates = [].concat(
  pages.map((page) => {
    return template({
      title: getTitle(page.title, page.showDefaultTitle),
      chunks: ["app", page?.pageName, ...(page.chunks || "")],
      showDefaultTitle:
        page?.showDefaultTitle || defaultOptions.showDefaultTitle,
      templateParameters: {
        assets: {
          js: ["app.js", `${page.indexFileName + ".js" ?? ""}`],
          css: ["app.css", `${page.indexFileName + ".css" ?? ""}`],
        },
      },
      template: `${
        page.path && page.outputName && page.indexFileName
          ? page.path + "/" + page.indexFileName
          : "src/templates/index"
      }.html`,
      filename: `${
        page.path && page.outputName ? page.outputName : "index"
      }.html`,
    });
  })
);

function template(Options) {
  return new HtmlWebpackPlugin({
    templateParameters: {},
    inject: true,
    hash: false,
    favicon: defaultOptions?.faviconPath ?? "",
    title: defaultOptions?.title,
    showDefaultTitle: defaultOptions?.showDefaultTitle,
    minify: defaultOptions?.minifyHtml ?? true,
    filename: defaultOptions?.filename ?? "index.html",
    chunks: defaultOptions?.chunks ?? "all",
    minimizerOptions: {
      caseSensitive: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
    },
    ...Options,
  });
}

module.exports = templates;

// HtmlWebpackPlugin documentation https://webpack.js.org/plugins/html-webpack-plugin/
