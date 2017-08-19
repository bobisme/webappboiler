import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'

const BUILD_PATH = path.resolve(__dirname, 'build')
const SRC_PATH = path.resolve(__dirname, 'src')

let cssLoader: webpack.Loader = {
  loader: require.resolve('typings-for-css-modules-loader'),
  options: {
    camelCase: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]',
    modules: true,
    namedExport: true,
  },
}

// Extracts css to separete files. Useful for caching and loading performance.
let cssExtractor = new ExtractTextPlugin({
  allChunks: true,
  filename: 'css/[name]-[chunkhash].css',
})

// The loader for the css extractor
let cssExtractorLoader: webpack.Loader = cssExtractor.extract({
  allChunks: true,
  fallback: 'style-loader',
  use: (
    'typings-for-css-modules-loader'
    + '?modules'
    + '&namedExport'
    + '&camelCase'
    + '&localIdentName=[local]___[hash:base64:5]'),
})

// the rule to do the inlined CSS loading
let cssStyleLoaderRule: webpack.Rule = {
  test: /\.css$/i,
  use: [{ loader: 'style-loader' }, cssLoader],
}

// the rule for extracted CSS loading
let cssExtractorRule: webpack.Rule = {
  include: [SRC_PATH],
  test: /\.css$/i,
  use: cssExtractorLoader,
}

let typescriptRule: webpack.Rule = {
  loader: 'awesome-typescript-loader',
  test: /\.tsx?$/,
}

function getHtmlPlugin(): webpack.Plugin {
  return new HtmlWebpackPlugin({
    inject: 'body',
    template: SRC_PATH + '/index.html',
    title: 'LiveRamp Publishers Dashboard',
  })
}

function getConfig(env = 'production'): webpack.Configuration {
  let config: webpack.Configuration = {
    devtool: 'cheap-module-source-map',
    // Entry-point of the single page application.
    entry: {
      app: ['./src/index.tsx'],
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
    } as webpack.NewModule,
    output: {
      filename: 'bundle.js',
      path: BUILD_PATH,
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${env}"` }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'],
      modules: [
        'node_modules',
        SRC_PATH,
      ],
    },
  }

  return config
}

function prodConfig(): webpack.Configuration {
  let config = getConfig('production')

  config.plugins = config.plugins.concat([
    // extract css to separate files
    cssExtractor,
    // minify js
    new webpack.optimize.UglifyJsPlugin(),
    // render the index.html, including the built files appropriately
    getHtmlPlugin(),
  ])

  return config
}

function devConfig(): webpack.Configuration {
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
  if (process.env.NODE_ENV === 'production') { return prodConfig() }
  return devConfig()
})() as webpack.Configuration
