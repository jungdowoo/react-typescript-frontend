const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: {
    allowedHosts: ['all'],
    port: 3000,
    open: true,
    hot: true,
  },
};
