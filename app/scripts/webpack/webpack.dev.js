"use strict";

const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env = {}) =>
  merge(common, {
    mode: "development",
    entry: "./src/index.tsx",
    watchOptions: {
      ignored: /node_modules/
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "../../build")
      },
      port: 3000,
      devMiddleware: {
        publicPath: "/"
      },
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    output: {
      pathinfo: false
    },
    optimization: {
      moduleIds: "named",
      runtimeChunk: true,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    cache: {
      type: "filesystem",
      name: "traceo-default-development",
      buildDependencies: {
        config: [__filename]
      }
    },

    plugins: [
      // parseInt(env.noTsCheck, 10)
      //   ? new DefinePlugin({})
      //   : new ForkTsCheckerWebpackPlugin({
      //       async: true,
      //       typescript: {
      //         mode: "write-references",
      //         memoryLimit: 4096,
      //         diagnosticOptions: {
      //           semantic: true,
      //           syntactic: true
      //         }
      //       }
      //     }),
      new ESLintPlugin({
        lintDirtyModulesOnly: true,
        extensions: [".ts", ".tsx"]
      }),
      new MiniCssExtractPlugin({
        filename: "traceo.[name].[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      })
    ]
  });
