const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const convertEncoding = require('gulp-convert-encoding');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const _ = require('lodash');
const args = require('yargs').argv;

