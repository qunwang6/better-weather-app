const path = require('path');

module.exports = {
  entry: './app/js/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app'),
  },
};