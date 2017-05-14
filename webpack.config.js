var path = require('path');
module.exports = {
  target: 'node',
  entry: [
  	'./src/main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/public/dist')
  },
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