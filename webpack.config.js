const path = require('path');
module.exports = {
  entry: './jjencode.mjs',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
	preferRelative: true
  }
};
