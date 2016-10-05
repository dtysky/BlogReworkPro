require('babel-polyfill');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

module.exports = {
    entry: {
        main: [path.resolve('./server/server.bin.js')]
    },

    output: {
        filename: 'server.js',
        path: path.resolve('./server/')
    },

    stats: {
        colors: true,
        reasons: true,
        errorDetails: true
    },

    target: 'node',

    node: {
        __filename: true,
        __dirname: true
    },

    // keep node_module paths out of the bundle
    externals: fs.readdirSync(path.resolve('node_modules'))
        .concat(['react-dom/server'])
        .reduce((ext, mod) => {
            ext[mod] = `commonjs ${mod}`;
            return ext;
        }, {}),

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
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
                test: /\.(css|less|png|jpg|gif|svg|woff|eot|woff2|ttf|json)$/,
                loader: 'file?emitFile=false&name=[name].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                SERVER_SIDE: JSON.stringify(true)
            }
        })
    ]
};
