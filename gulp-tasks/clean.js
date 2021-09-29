'use strict';

const del = require('del');

function clean() {
    return del(global.config.base.dist);
}

module.exports = clean;