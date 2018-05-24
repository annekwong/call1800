const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css',
});

module.exports = {
  entry: './src/index.js',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          fallback: ['style-loader'],
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
    ],
  },

  plugins: [
    extractPlugin,
    new CleanWebpackPlugin(['dist']),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // library: '',
    library: 'call1800js',
    libraryExport: 'default',
    libraryTarget: 'umd',
    // Prevents webpack from referencing `window` in the UMD build
    // Source: https://git.io/vppgU
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
};
