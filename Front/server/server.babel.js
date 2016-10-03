/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

require('babel-register')({
    presets: ['react', 'es2015', 'stage-0'],
    plugins: [
        'transform-runtime',
        'add-module-exports',
        'transform-decorators-legacy',
        'transform-react-display-name',
        'syntax-async-functions',
        'transform-regenerator',
        'transform-async-to-generator',
        'transform-class-properties',
        [
            'babel-plugin-transform-require-ignore',
            {
                extensions: ['.less', '.css']
            }
        ]
    ]
});
