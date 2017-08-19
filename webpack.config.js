const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BUILD_PATH = path.resolve(__dirname, 'build')
const SRC_PATH = path.resolve(__dirname, 'src')

let cssLoader = {
  loader: require.resolve('typings-for-css-modules-loader'),
  options: {
    importLoaders: 1,
    modules: true,
    namedExport: true,
    camelCase: true,
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
}

// Extracts css to separete files. Useful for caching and loading performance.
let cssExtractor = new ExtractTextPlugin(
  { filename: 'css/[name]-[chunkhash].css', allChunks: true })

// The loader for the css extractor
let cssExtractorLoader = cssExtractor.extract({
  use: (
    'typings-for-css-modules-loader'
    + '?modules'
    + '&namedExport'
    + '&camelCase'
    + '&localIdentName=[local]___[hash:base64:5]'),
  fallback: 'style-loader',
  allChunks: true,
})

// the rule to do the inlined CSS loading
let cssStyleLoaderRule = {
  test: /\.css$/i,
  use: [{ loader: 'style-loader' }, cssLoader],
}

// the rule for extracted CSS loading
let cssExtractorRule = {
  test: /\.css$/i,
  use: cssExtractorLoader,
  include: [SRC_PATH],
}

let typescriptRule = { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }

function getHtmlPlugin() {
  return new HtmlWebpackPlugin({
    title: 'LiveRamp Publishers Dashboard',
    template: SRC_PATH + '/index.html',
    inject: 'body',
  })
}

function getConfig(env = 'production') {
  let config = {
    // Entry-point of the single page application.
    entry: {
      app: ['./src/index.tsx'],
    },

    output: {
      path: BUILD_PATH,
      filename: 'bundle.js',
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'],
      modules: [
        'node_modules',
        SRC_PATH,
      ],
    },

    module: {
      rules: [
        // Replace the extract-text-plugin rule for styles with the
        // style-loader, which inlines style.  This is because extracted files
        // can't be hot reloaded.
        (env === 'production') ? cssExtractorRule : cssStyleLoaderRule,
        typescriptRule,
        // babelRule,
        // jsonRule,
      ],
    },

    devtool: 'cheap-module-source-map',

    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${env}"` }),
    ],
  }

  return config
}

function prodConfig() {
  let config = getConfig('production')

  config.plugins = config.plugins.concat([
    // extract css to separate files
    cssExtractor,
    // minify js
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    // render the index.html, including the built files appropriately
    getHtmlPlugin(),
  ])

  return config
}

function devConfig() {
  let config = getConfig('dev')
  config.output.publicPath = '/'

  config.entry = [
    SRC_PATH + '/index.tsx',
  ]

  // configuration for the webpack dev server
  config.devServer = {
    contentBase: BUILD_PATH,

    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,

    // Enable hot module replacement.
    hot: true,
    inline: true,

    // stats: 'errors-only',

    // host: '0.0.0.0',
    port: 3002,
  }

  // redefine plugins
  config.plugins = [
    ...config.plugins,
    // enable hot-reloading of javascript and css
    new webpack.HotModuleReplacementPlugin(),
    // render the index.html, including the built files appropriately
    // getHtmlPlugin(),
  ]

  return config
}

module.exports = (() => {
  if (process.env.NODE_ENV === 'production') return prodConfig()
  return devConfig()
})()

