'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const through2 = require('through2').obj;
const browserSync = require('browser-sync');

function processStyles() {
    return gulp.src(global.config.pathes.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(through2((file, enc, callback) => {
            file.stat.mtime = new Date();
            callback(null, file);
        }))
        .pipe(gulp.dest(`${global.config.base.dist}/styles/`))
        .on('end', () => browserSync.reload());
}

module.exports = processStyles;
