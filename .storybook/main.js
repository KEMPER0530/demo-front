const path = require('path');
const rootPath = path.resolve(__dirname, '../');
module.exports = {
  webpackFinal: async (config, { configType }) => {

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader',
        {
          loader: 'sass-loader',
          options: {
            prependData: `
        '../../assets/css/signin.scss',
        '../../assets/css/search.scss',
        '../../assets/css/tailwind.css',
        'element-ui/lib/theme-chalk/index.css',
            `
          }
        }
      ],
      include: rootPath
    });
    config.resolve.alias['~'] = rootPath;
    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/vue"
}
