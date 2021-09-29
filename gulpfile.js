'use strict';
var gulp = require('gulp');

global.config = {
    base: {
        app: 'src/',
        dist: 'dist/'
    },
    pathes: {
        staticFiles: 'assets/{fonts,icons,img,animation}/**/*',
        styles: ['./src/**/*.{css,scss}'],
        scss: [`./src/pages/home/home.scss`],
        mainJs: ['./src/pages/home/home.js'],
        js: './src/**/*.js',
        templates: './src/**/*.html',
        pages: ['./src/index.html']
    }
};

const preProcessPages = require('./gulp-tasks/process-pages');
const processJs = require('./gulp-tasks/process-js');
const processStyles = require('./gulp-tasks/process-styles');
const clean = require('./gulp-tasks/clean');
const copyStatic = require('./gulp-tasks/copy-static');
const develop = require('./gulp-tasks/develop-task');
const precommit = require('./gulp-tasks/precommit');
const browserify = require('./gulp-tasks/browserify');

gulp.task('clean', clean);

gulp.task('preProcessPages', preProcessPages);

gulp.task('processJs', processJs);

gulp.task('processStyles', processStyles);

gulp.task('copyStatic', copyStatic);

gulp.task('develop', develop);

gulp.task('precommit', precommit);

gulp.task('browserify', browserify);

/**
 * Task for prod environment.
 */
gulp.task(
    'build',
    gulp.series('clean', gulp.parallel('processStyles', 'copyStatic', 'processJs'), gulp.parallel('preProcessPages'))
);

/**
 * Task for dev environment.
 */
gulp.task(
    'default',
    gulp.series(
        'clean',
        gulp.parallel('processStyles', 'copyStatic', 'preProcessPages'),
        gulp.parallel('processJs', 'develop', 'browserify')
    )
);
