var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  target: 'node',
  entry: [
  	'./src/main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/public/dist'),
    publicPath: '/'
  },
  resolve: {
        alias: {
            assets: path.resolve(__dirname, 'public')
        }
  },
  plugins: [
    /*new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname + '/views/index.html'),
      inject: 'body',
      filename: 'index.html'
    }),*/
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: path.resolve(__dirname,"./node_modules"),
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }
  ]
}
};