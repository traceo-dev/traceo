const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tailwindcss = require("tailwindcss");

module.exports = {
  target: "web",
  entry: {
    app: "./src/index.tsx"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../../build")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".svg"],
    alias: {
      prismjs: require.resolve("prismjs")
    },
    modules: ["node_modules"],
    fallback: {
      buffer: false,
      fs: false,
      stream: false,
      http: false,
      https: false,
      string_decoder: false
    },
    symlinks: false
  },
  ignoreWarnings: [/export .* was not found in/],
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
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false,
              minimize: {
                removeComments: false,
                collapseWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: /\.module\.css$/
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // Convert images < 8kb to base64 strings
              name: "images/[hash]-[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      cacheGroups: {
        // TODO: to think about some libs from node_modules, maybe antd?
        defaultVendors: {
          test: /[\\/]node_modules[\\/].*[jt]sx?$/,
          chunks: "initial",
          priority: -10,
          reuseExistingChunk: true,
          enforce: true
        },
        default: {
          priority: -20,
          chunks: "all",
          test: /.*[jt]sx?$/,
          reuseExistingChunk: true
        }
      }
    }
  }
};
