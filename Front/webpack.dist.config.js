/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('./config');
var paths = config.paths;
const srcPath = paths.srcPath;

module.exports = {
    cache: true,
    debug: true,
    entry: {
        main: [path.join(srcPath, 'index.js')]
    },

    output: {
        path: paths.distPath + "/assets/",
        filename: "main.js",
        publicPath: '/assets/'
    },

    stats: {
        colors: true,
        reasons: true,
        errorDetails: true
    },

    devtool: false,

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js"],
        alias: {
            config: "config.js"
        }
    },

    target: "electron",

    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules|src\/theme\/*/,
            loader: 'jsxhint'
        }],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot',
                    'babel?presets[]=react,presets[]=es2015'
                ],
                include : srcPath
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: 'url?limit=10'
            },
            {
                test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                loader : 'url?prefix=font/&limit=10000'
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ],
        noParse:[
            "jquery",
            /autoit.js/
        ]
    },

    plugins: [
        new ExtractTextPlugin("main.css"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $:'jquery'
        })
    ]
};
