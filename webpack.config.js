const path = require("path");

const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const dev = process.env.NODE_ENV != "production";

module.exports = {
  entry: [
    // The actual app
    "./client/main.js",
    // hot reloading client connection
    dev && "webpack-hot-middleware/client"
  ].filter(Boolean),

  devtool: dev ? "cheap-module-source-map" : false,

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    dev && new webpack.HotModuleReplacementPlugin(),
    !dev && new CleanWebpackPlugin(["dist"]),
    !dev && new UglifyJSPlugin()
  ].filter(Boolean),

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  }
};
