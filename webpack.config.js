const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/linger.js',
  output: {
    filename: 'linger.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
