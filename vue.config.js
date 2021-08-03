const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const isLib = process.env.NODE_ENV === 'lib';

module.exports = {
  chainWebpack(config) {
    if (!isLib) {
      config.plugin('monaco').use(new MonacoWebpackPlugin());
    }
  },
};
