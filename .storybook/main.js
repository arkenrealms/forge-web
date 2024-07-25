const path = require('path')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, options) => {
    if (!config.module.rules) config.module.rules = []

    console.log('zzzz')
    // Remove original less loader
    config.module.rules = config.module.rules.filter((f) => f.test.toString() !== '/\\.less$/')

    // Less
    // config.module.rules.push({
    //   test: /\.less$/,
    //   include: [
    //     // Include antd to rebuild
    //     /[\\/]node_modules[\\/].*antd/,
    //     path.resolve(__dirname, '../assets/styles'),
    //   ],
    //   use: [
    //     'style-loader',
    //     'css-loader',
    //     {
    //       loader: 'less-loader',
    //       options: {
    //         javascriptEnabled: true,
    //       },
    //     },
    //   ],
    // })

    // config.plugins.push(
    //   // Removing Speedy so the static storybook styling doesn't break
    //   new webpack.DefinePlugin({
    //     SC_DISABLE_SPEEDY: true
    //   })
    // );

    config.module.rules.push({
      test: /\.less$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    })
    config.module.rules.push({
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    })

    //...

    return config
  },
}
