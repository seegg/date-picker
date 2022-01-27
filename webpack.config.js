const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: ['./src/datepicker.ts'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'datepicker.min.js'
  },
  watch: true,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(j|t)s$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  devtool: 'source-map',
}