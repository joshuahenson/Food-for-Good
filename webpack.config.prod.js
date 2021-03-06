const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {resolve} = require('path')

const common = require('./webpack.config')

module.exports = merge(common, {
  entry: {
    app: [
      'whatwg-fetch',
      resolve(__dirname, 'client', 'app.js')
    ]
  },
  output: {
    path: resolve(__dirname, 'dist', 'client'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract('css-loader?sourceMap')
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([{
      from: resolve(__dirname, 'assets'),
      to: resolve(__dirname, 'dist', 'client')
    }])
  ],
  devtool: 'cheap-module-source-map'
})
