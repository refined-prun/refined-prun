const { merge } = require('webpack-merge');
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: 'development',
  devtool: "cheap-module-source-map",
  watch: true,
});
