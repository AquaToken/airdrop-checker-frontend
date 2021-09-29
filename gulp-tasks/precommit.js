'use strict';

const gulp = require('gulp');
// const jshint = require('gulp-jshint');
// const jscs = require('gulp-jscs');

function precommit() {

    return gulp.src(global.config.pathes.js)
        // .pipe(jshint())
        // .pipe(jscs())
        // .pipe(jshint.reporter('default'))
        // .pipe(jscs.reporter())
        // .pipe(jshint.reporter('fail'))
        // .pipe(jscs.reporter('fail'));
}

module.exports = precommit;
