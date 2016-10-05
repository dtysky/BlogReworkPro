require('babel-polyfill');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const themeResourceSite = require('./config').themeResourceSite;

module.exports = {
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
                loader: `url?limit=8000&emitFile=false&name=${themeResourceSite}/image/[name].[ext]`
            },
            {
                test: /\/katex\/.*\.(woff|eot|woff2|ttf|svg)/,
                loader: `file?emitFile=false&name=${themeResourceSite}/font/katex/[name].[ext]`
            },
            {
                test: /\.woff|\.woff2|.eot|\.ttf/,
                loader: `url?prefix=font/&limit=8000&emitFile=false&name=${themeResourceSite}/font/[name].[ext]`,
                exclude: /katex/
            },
            {
                test: /\.json$/,
                loader: 'file?emitFile=false&name=[name].[ext]'
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                SERVER_SIDE: JSON.stringify(false)
            }
        })
    ]
};
