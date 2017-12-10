const express = require("express");

const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("../webpack.config");

module.exports = function wrapWithWebpack(app) {
  const outerApp = express();

  const compiler = webpack(webpackConfig);
  outerApp.use(
    devMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );
  outerApp.use(hotMiddleware(compiler));

  outerApp.use(app);

  return outerApp;
};
