const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const env = require('dotenv').config().parsed;

function HACK_removeMinimizeOptionFromCssLoaders(config) {
  console.warn(
    'HACK: Removing `minimize` option from `css-loader` entries in Webpack config',
  );
  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === 'css-loader' && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });
}

module.exports = withCSS({
  webpack(config) {
    HACK_removeMinimizeOptionFromCssLoaders(config);
    config.plugins.push(new webpack.EnvironmentPlugin(env));
    return config;
  },
});