const path = require('path');

module.exports = {
    entry: {
        common: '.public/js/src/common',
        index: '.public/js/src/index',
        contacts: '.public/js/src/contacts',
        about: '.public/js/src/about',
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: './public/js/dist',
        chunkFilename: '[name].[chunkhash].bundle.js',
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 1,
            minChunks: 2
        }
    },
}
