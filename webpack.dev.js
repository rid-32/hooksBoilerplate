const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
]

const cssLoader = {
  test: /\.(s)?css$/,
  use: ['style-loader'],
}

module.exports = merge.smart(
  {
    mode: 'development',
    module: {
      rules: [cssLoader],
    },
    plugins,
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3000,
      hot: true,
      compress: true,
    },
  },
  common,
)
