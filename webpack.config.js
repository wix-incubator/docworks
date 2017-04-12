var path = require('path');
var webpack = require('webpack');
var NODE_MODULES_PATH = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'eval',
  entry: {
    'bundle': [
        'webpack-hot-middleware/client?reload=true',
        './src/client'
    ],
    'api-bundle': [
      'webpack-hot-middleware/client?reload=true',
      './src/apisClient'
    ]}
  ,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
      __CLIENT__: JSON.stringify(true),
      __SERVER__: JSON.stringify(false),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: NODE_MODULES_PATH
      },
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'],
        include: [
          path.join(__dirname, 'node_modules/wix-style-react/src/Button')
        ]
      },
      {
        test: /\.scss$/,
        loader: ['react-hot!style!css?modules!postcss!sass'],
        include: [
          path.join(__dirname, 'node_modules/wix-style-react')
        ]
      }
    ]
  }
};
