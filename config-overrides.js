const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'); // Import the plugin

module.exports = function (config, env) {
  if (!config.resolve) config.resolve = {};
  if (!config.resolve.fallback) config.resolve.fallback = {};

  config.cache = true;

  config.optimization = {
    ...config.optimization,
    minimizer: [
      ...(config.optimization.minimizer || []),
      new TerserPlugin({
        parallel: 2,
      }),
    ],
    usedExports: true,
  };

  // Setting fallbacks correctly
  config.resolve.fallback = {
    fs: require.resolve('browserify-fs'), // Disable fs in the browser
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    assert: false, // require.resolve('assert'),
    url: require.resolve('url'), // For browser-compatible URL handling
    // process: require.resolve('process/browser'),
    crypto: require.resolve('crypto-browserify'),
    util: false,
    http: false,
    https: false,
    zlib: false,
    net: false,
    tls: false,
    dns: false,
    child_process: false,
    readline: false,
    os: false,
    module: false,
    constants: false,
  };

  config.externals = {
    // Exclude puppeteer from the browser bundle
    puppeteer: 'commonjs puppeteer',
    // Exclude other Node.js specific libraries you do not need in the browser
    'puppeteer-core': 'commonjs puppeteer-core',
    '@puppeteer/browsers': 'commonjs @puppeteer/browsers',
    perf_hooks: 'commonjs perf_hooks',
    yargs: 'commonjs yargs',
    'yargs-parser': 'commonjs yargs-parser',
    typescript: 'commonjs typescript',
    // Add other Node.js-specific modules here as needed
  };

  // Resolve aliases
  config.resolve.alias = {
    '~': path.resolve(__dirname, './src'),
    // 'ethereumjs-util': false,
    // 'process/browser': false, // require.resolve('process/browser.js'), // Ensure correct resolution
    fs: false,
    path: false,
    net: false,
    tls: false,
    child_process: false,
    process: false,
    // util: false,
    crypto: false,
    stream: false,
    http: false,
    https: false,
    zlib: false,
    module: false,
    dns: false,
  };

  // Update the extensions array to include .mjs and .js
  config.resolve.extensions = ['.tsx', '.ts', '.js', '.jsx', '.mjs', '.json'];

  // Adjust dev server configuration
  config.devServer = {
    ...(config.devServer || {}),
    hot: false,
    inline: false,
    liveReload: false,
    overlay: false,
  };

  // Define module rules
  config.module = {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['styled-components'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|otf)$/i,
        use: ['file-loader'],
        exclude: /node_modules/,
      },
    ],
  };
  console.log(config.plugins);
  // Plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  // config.plugins.push(
  //   new ForkTsCheckerWebpackPlugin({
  //     async: false,
  //     typescript: {
  //       memoryLimit: 8192, // Adjust as needed
  //     },
  //   })
  // );

  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  //   })
  // );
  // config.plugins.push(
  //   new webpack.IgnorePlugin({
  //     resourceRegExp: /assert|util|other-node-specific-modules/,
  //     contextRegExp: /ethereumjs-util|some-other-module/,
  //   })
  // );

  config.plugins.push(
    new Dotenv({
      systemvars: true,
    })
  );

  return config;
};
