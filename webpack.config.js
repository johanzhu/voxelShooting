var path = require('path');
module.exports = {
  target: 'node',
  entry: [
  	'./public/js/player.js',
  	'./public/js/main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/public/dist')
  }
};