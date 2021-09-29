'use strict';

const browserSync = require('browser-sync');

function browserify() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

module.exports = browserify;
