'use strict';

const gulp = require('gulp');
const copy = require('gulp-copy');
const config = global.config;

function copyStatic() {
    return gulp.src(config.pathes.staticFiles, {cwd: config.base.app})
        .pipe(copy(config.base.dist));
}

module.exports = copyStatic;