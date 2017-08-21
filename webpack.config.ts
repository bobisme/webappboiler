import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'

const BUILD_PATH = path.resolve(__dirname, 'build')
const SRC_PATH = path.resolve(__dirname, 'src')

const CLASS_PATTERN = '[local]___[hash:base64:5]'

let cssLoader: webpack.Loader = {
  loader: require.resolve('typings-for-css-modules-loader'),
  options: {
    camelCase: true,
    importLoaders: 1,
    localIdentName: CLASS_PATTERN,
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
    + `&localIdentName=${CLASS_PATTERN}`),
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
      index: './src/pages/index.tsx',
    },
    module: {
      rules: [
        typescriptRule,
        // Replace the extract-text-plugin rule for styles with the
        // style-loader, which inlines style.  This is because extracted files
        // can't be hot reloaded.
        // (env === 'production') ? cssExtractorRule : cssStyleLoaderRule,
        // jsonRule,
      ],
    } as webpack.NewModule,
    output: {
      filename: '[name].js',
      path: BUILD_PATH,
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${env}"` }),
    ],
    resolve: {
      alias: {
        components: path.resolve(SRC_PATH, 'components'),
        pages: path.resolve(SRC_PATH, 'pages'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'],
      modules: [
        'node_modules',
        SRC_PATH,
      ],
    },
  }

  return config
}

function serverConfig(): webpack.Configuration {
  let config = getConfig('production')
  config.entry = { server: './src/server/index.ts' }

  let module = config.module as webpack.NewModule
  // module.rules.push(cssStyleLoaderRule)

  let serverCssLoader = {
    // Locals only loads class names.
    loader: 'css-loader/locals',
    options: {
      camelCase: true,
      localIdentName: CLASS_PATTERN,
      modules: true,
    },
  }

  module.rules.push({
    test: /\.css$/i,
    use: [serverCssLoader],
  })

  config.target = 'node'
  config.node = {
    __dirname: false,
  }
  return config
}

function prodConfig(): webpack.Configuration {
  let config = getConfig('production')

  let rules = (config.module as webpack.NewModule).rules
  rules.push(cssExtractorRule)

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

  // Object.getOwnPropertyNames(config.entry)
  //   .forEach(x => {
  //     config.entry[x] = ['react-hot-loader/patch', config.entry[x]]
  //   })

  // configuration for the webpack dev server
  config.devServer = {
    contentBase: BUILD_PATH,

    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: {
      index: 'index.html',
    },

    // Enable hot module replacement.
    hot: true,
    inline: true,

    // stats: 'errors-only',

    // host: '0.0.0.0',
    port: 3002,
  }

  let rules = (config.module as webpack.NewModule).rules
  rules.push(cssStyleLoaderRule)

  // redefine plugins
  config.plugins = [
    ...config.plugins,
    // Show module instead of a number when hot reloading.
    new webpack.NamedModulesPlugin(),
    // enable hot-reloading of javascript and css
    new webpack.HotModuleReplacementPlugin(),
    // render the index.html, including the built files appropriately
    getHtmlPlugin(),
  ]

  return config
}

module.exports = (() => {
  if (process.env.NODE_ENV === 'production') {
    return [prodConfig(), serverConfig()]
  }
  return devConfig()
})() as webpack.Configuration
