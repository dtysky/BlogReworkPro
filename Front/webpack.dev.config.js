/*
 * Webpack development configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

require('babel-polyfill');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    watch: true,
    cache: true,
    debug: true,
    entry: {
        main: ['./src/index.js']
    },

    output: {
        filename: 'name].bundle.js',
        path: './dist/assets/'
    },

    stats: {
        colors: true,
        reasons: true,
        errorDetails: true
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx', '.json']
    },

    module: {
        preLoaders: [
            {
                test: /\.js/,
                loader: 'eslint'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('less')
            }
//            {
//                test: /\.(png|jpg|gif|woff|woff2)$/,
//                loader: 'url?limit=10'
//            },
//            {
//                test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
//                loader: 'url?prefix=font/&limit=10000'
//            }
        ],
        noParse: [
            'jquery',
            /autoit.js/
        ]
    },

    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                BROWSER: JSON.stringify(true)
            }
        })
    ]
};
