'use strict';

const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const through2 = require('through2').obj;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');

function preProcessPages() {
    return gulp.src(global.config.pathes.pages)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Landing',
                message: err.message
            }))
        }))
        .pipe(preprocess())
        .pipe(through2((file, enc, callback) => {
            file.stat.mtime = new Date();
            callback(null, file);
        }))
        .pipe(gulp.dest(global.config.base.dist))
        .on('end', () => browserSync.reload());

}

module.exports = preProcessPages;
