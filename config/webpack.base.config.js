/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const SRC_DIR = path.resolve(__dirname, '../src');
const DST_DIR = path.resolve(__dirname, '../dist');

module.exports = (env) => {
  const { PLATFORM, VERSION } = env;
  return merge([
    {
      entry: path.join(SRC_DIR, 'app.js'),
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
      output: {
        filename: 'linger.js',
        path: DST_DIR,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.VERSION': JSON.stringify(VERSION),
          'process.env.PLATFORM': JSON.stringify(PLATFORM),
        }),
      ],
    },
  ]);
};
