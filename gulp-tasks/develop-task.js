'use strict';

const gulp = require('gulp');

function develop() {
        let staticPath = `${global.config.base.app}${global.config.pathes.staticFiles}`;
        gulp.watch(global.config.pathes.styles,  gulp.series('processStyles'));
        gulp.watch(global.config.pathes.js,  gulp.series('processJs'));
        gulp.watch([...global.config.pathes.pages, global.config.pathes.templates],  gulp.series('preProcessPages'));
        gulp.watch(staticPath,  gulp.series('copyStatic'));
}

module.exports = develop;
