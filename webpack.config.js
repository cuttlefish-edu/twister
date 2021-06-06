const path = require('path');

module.exports = {
  entry: './jjencode.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
