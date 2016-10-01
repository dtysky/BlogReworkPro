/*
 * Webpack development configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

require('babel-polyfill');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
    watch: true,
    cache: true,
    debug: true,
    entry: {
        main: [path.resolve('./src/index.js')]
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve('./dist/assets/')
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
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url?limit=8000&emitFile=false&name=/theme/image/[name].[ext]'
            },
            {
                test: /\/katex\/.*\.(woff|eot|woff2|ttf|svg)/,
                loader: 'file?emitFile=false&name=/theme/font/katex/[name].[ext]'
            },
            {
                test: /\.woff|\.woff2|.eot|\.ttf/,
                loader: 'url?prefix=font/&limit=8000&emitFile=false&name=/theme/font/[name].[ext]',
                exclude: /katex/
            }
        ],
        noParse: [
            'jquery'
        ]
    },

    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.HotModuleReplacementPlugin(),
//        new webpack.NoErrorsPlugin(),
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
