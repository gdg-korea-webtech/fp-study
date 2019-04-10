const path = require('path')

module.exports = {
  mode: 'development',
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
          }
        },
      },
    ],
  },
}