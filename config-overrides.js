/* eslint-disable @typescript-eslint/no-var-requires */
const {
  override,
  fixBabelImports,
  addBabelPlugins,
  removeModuleScopePlugin,
  addWebpackAlias,
  addBabelPreset,
} = require('customize-cra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const rewireBabelLoader = require('react-app-rewire-babel-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const fs = require('fs');
const processOverride = require('./process-override.js');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const deps = require('./package.json').dependencies;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const Dotenv = require('dotenv-webpack');

require('dotenv').config();

module.exports = function (config, env) {
  if (!config.resolve) config.resolve = {};
  if (!config.resolve.fallback) config.resolve.fallback = {};

  config.optimization = {
    minimizer: [
      new TerserPlugin({
        parallel: 2,
      }),
    ],
  };

  config.resolve.symlinks = true;
  config.resolve.fallback.path = require.resolve('path-browserify');
  config.resolve.fallback.fs = require.resolve('browserify-fs');
  config.resolve.fallback.util = false;

  config.resolve.fallback.os = false;
  config.resolve.fallback.http = false;
  config.resolve.fallback.https = false;

  config.resolve.fallback.child_process = false;
  config.resolve.fallback.stream = require.resolve('stream-browserify');
  config.resolve.fallback.buffer = require.resolve('buffer');
  config.resolve.fallback.readline = false;
  config.resolve.fallback.crypto = false;
  config.resolve.fallback.url = false;

  config.resolve.alias = {
    '~': path.resolve(__dirname, './src'),
  };

  config.devServer = {
    ...(config.devServer || {}),

    hot: false,
    inline: false,
    liveReload: false,
    overlay: false,
  };
  config.devServer = {};

  config.module.rules.at(-1).oneOf[3].options.plugins.splice(1, 1);
  config.module = {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
      },
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
          plugins: ['styled-components'],
        },
        test: /\.tsx$/,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        // exclude: /node_modules/,
      },
      {
        loader: 'file-loader',
        test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|otf)$/i,
        exclude: /node_modules/,
      },
    ],
  };

  config.plugins.splice(4, 1);
  config.plugins.splice(1, 1);

  // Work around for Buffer is undefined:
  // https://github.com/webpack/changelog-v5/issues/10
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  config.plugins.push(
    new Dotenv({
      systemvars: true,
    })
  );

  config.plugins.push(
    new webpack.ProvidePlugin({
      'process/browser': require.resolve('process/browser'),
    })
  );

  // config.resolve.modules = [path.resolve(__dirname), 'node_modules']
  // config.plugins.push(new BundleAnalyzerPlugin())

  return config;
};
// module.exports = override(
//   // fixBabelImports('import', {
//   //   libraryName: 'antd',
//   //   libraryDirectory: 'es',
//   //   style: 'css',
//   // }),
//   function (config, env) {
//     if (!config.resolve) config.resolve = {}
//     if (!config.resolve.fallback) config.resolve.fallback = {}

//     config.optimization = {
//       minimizer: [
//         new TerserPlugin({
//           parallel: 2,
//         }),
//       ],
//     }

//     config.resolve.symlinks = true
//     config.resolve.fallback.path = require.resolve('path-browserify')
//     config.resolve.fallback.fs = require.resolve('browserify-fs')
//     config.resolve.fallback.os = false
//     config.resolve.fallback.http = false
//     config.resolve.fallback.https = false

//     config.resolve.fallback.child_process = false
//     config.resolve.fallback.stream = require.resolve('stream-browserify')
//     config.resolve.fallback.buffer = require.resolve('buffer')
//     config.resolve.fallback.readline = false
//     config.resolve.fallback.crypto = false
//     config.resolve.fallback.url = false

//     config.resolve.alias = {
//       '~': path.resolve(__dirname, 'src'),
//     }

//     config.devServer = {
//       ...(config.devServer || {}),

//       hot: false,
//       inline: false,
//       liveReload: false,
//       overlay: false,
//     }
//     config.devServer = {}

//     config.module.rules.at(-1).oneOf[3].options.plugins.splice(1, 1)
//     config.module = {
//       rules: [
//         {
//           loader: 'ts-loader',
//           test: /\.[jt]sx?$/,
//           exclude: /node_modules/,
//         },
//         {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-react', '@babel/preset-typescript'],
//             plugins: ['styled-components'],
//           },
//           test: /\.tsx$/,
//           exclude: /node_modules/,
//         },
//         {
//           test: /\.css$/,
//           use: ['style-loader', 'css-loader', 'postcss-loader'],
//           exclude: /node_modules/,
//         },
//         {
//           loader: 'file-loader',
//           test: /\.(jpe?g|png|gif|svg)$/i,
//           exclude: /node_modules/,
//         },
//       ],
//     }

//     config.plugins.splice(4, 1)
//     config.plugins.splice(1, 1)

//     // Work around for Buffer is undefined:
//     // https://github.com/webpack/changelog-v5/issues/10
//     config.plugins.push(
//       new webpack.ProvidePlugin({
//         Buffer: ['buffer', 'Buffer'],
//       })
//     )

//     config.plugins.push(
//       new Dotenv({
//         systemvars: true,
//       })
//     )

//     config.plugins.push(
//       new webpack.ProvidePlugin({
//         'process/browser': require.resolve('process/browser'),
//       })
//     )

//     // config.plugins.push(new BundleAnalyzerPlugin())

//     return config
//   },
//   addWebpackAlias({
//     '~': path.resolve(__dirname, 'src'),
//     '@arken/forge-ui': path.resolve(__dirname, '../ui/src'),
//   }),
//   ...addBabelPlugins(
//     '@babel/transform-runtime',
//     '@babel/plugin-proposal-optional-chaining',
//     '@babel/plugin-proposal-nullish-coalescing-operator'
//   ),
//   addBabelPreset('@babel/preset-typescript'),

//   // babelInclude([path.resolve('src'), path.resolve('../common')]),
//   removeModuleScopePlugin(),
//   // (config) => {
//   //   console.log('Webpack config before alias:', config)
//   //   return config
//   // },
//   // addWebpackAlias({
//   //   '~': path.resolve(__dirname, 'src'),
//   //   '@arken/forge-ui': path.resolve(__dirname, '../ui/src'),
//   // }),
//   function (config) {
//     console.log('Webpack config after alias:', config)
//     return config
//   }
// )
