const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const argv = require("yargs").argv;
const envConfig = require(`./webpack.${argv.env}.js`);

module.exports = merge(commonConfig, envConfig);