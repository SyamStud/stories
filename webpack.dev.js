const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});