const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env, argv = {}) => {
  const IS_PROD = argv.mode === 'production'
  return {
    mode: 'development',
    entry: './index.tsx',
    devtool: IS_PROD ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'index.js'
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin()
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlPlugin({
        template: 'template/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      })
    ],
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            {
              loader: IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader'
            },
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                sass: true,
                namedExport: true,
                camelCase: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx']
    }
  }
}
