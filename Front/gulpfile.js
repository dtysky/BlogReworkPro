/* eslint-disable */

const gulp = require('gulp');
const gulpsync = require('gulp-sync')(gulp);
const gutil = require("gulp-util");
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const convertEncoding = require('gulp-convert-encoding');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const _ = require('lodash');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.dev.config.js');

const fs = require('fs');

gulp.task('default', ['development']);

gulp.task('clean-all', () => {
    return gulp.src(['dist/*'], {read:false})
        .pipe(clean());
});

gulp.task('copy-index', () => {
    return gulp.src(['src/index.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-theme', () => {
    return gulp.src(
        ['src/theme/font/**/*', 'src/theme/image/**/*'],
        {base: 'src/theme'}
    ).pipe(gulp.dest('dist/theme'));
});

gulp.task('development', gulpsync.sync(['clean-all', 'copy-index', 'copy-theme']), (callback) => {
    gulp.watch(['src/index.html'], ['copy-index']);
    gulp.watch(['src/theme/font/**/*', 'src/theme/image/**/*'], ['copy-theme']);
    webpack(webpackDevConfig, (err, stats) => {
        if(err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
    });
});

/* eslint-enable */
