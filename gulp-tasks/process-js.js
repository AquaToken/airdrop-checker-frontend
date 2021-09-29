'use strict';

const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const named = require('vinyl-named');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const argv = require('yargs').argv;
const browserSync = require('browser-sync');
const ESLintPlugin = require('eslint-webpack-plugin');

const ENV = global.config.ENV || argv.env;

function processJs() {
    let plugins = ENV === 'dev' ? null : ['@babel/plugin-transform-runtime'];

    let options = {
        watch: ENV === 'dev',
        devtool: ENV === 'dev' ? 'cheap-module-inline-source-map' : false,
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    include: [/src/]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: [['@babel/preset-env']],
                        plugins: plugins
                    },
                    exclude: [/node_modules/, /assets/]
                },
                {
                    test: /\.json/,
                    loader: 'json-loader'
                }
            ]
        },
        plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.ProvidePlugin({}), new ESLintPlugin()]
    };

    return gulp
        .src(global.config.pathes.mainJs)
        .pipe(
            plumber({
                errorHandler: notify.onError(err => ({
                    title: 'Webpack',
                    message: err.message
                }))
            })
        )
        .pipe(named())
        .pipe(webpackStream(options))
        .pipe(gulpif(ENV !== 'dev', uglify()))
        .pipe(gulp.dest(`${global.config.base.dist}/scripts/`))
        .on('data', () => browserSync.reload());
}

module.exports = processJs;
