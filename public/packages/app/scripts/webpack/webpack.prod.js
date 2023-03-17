"use strict";
0;
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = (env = {}) =>
  merge(common, {
    mode: "production",
    devtool: false,
    output: {
      pathinfo: false,
      clean: true
    },
    optimization: {
      moduleIds: "named",
      runtimeChunk: true,
      removeAvailableModules: false,
      removeEmptyChunks: true,
      splitChunks: false,
      usedExports: true,
      minimizer: ["...", new CssMinimizerPlugin()]
    },
    performance: {
      hints: false,
      maxEntrypointSize: 5120000,
      maxAssetSize: 5120000
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"]
      }),
      new ESLintPlugin({
        lintDirtyModulesOnly: true,
        extensions: [".ts", ".tsx"]
      }),
      new MiniCssExtractPlugin({
        filename: "traceo.[name].[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/traceo-fav.PNG"
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/img/svg', to: 'img/svg' },
        ],
      }),
    ]
  });
