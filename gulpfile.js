'use strict';

let gulp          = require('gulp'),
    gulpPlugin    = require('gulp-load-plugins')(),
    webpack       = require("webpack"),
    webpackConfig = require('./webpack.config');

gulp.task('scripts', function(cb) {
    webpack(webpackConfig, function(err, stats) {
        if (err) {
            throw new gulpPlugin.util.PluginError('webpack', err);
        }
        gulpPlugin.util.log('[webpack]', stats.toString({
            colors: true
        }));

        cb();
    });
});

gulp.task('styles:watch', function () {
  gulp.watch('./assets/styles/*', ['scripts']);
});

gulp.task('scripts:watch', function () {
  gulp.watch('./assets/scripts/*.js', ['scripts']);
  gulp.watch('./assets/scripts/**/*.js', ['scripts']);
  gulp.watch('./index.js', ['scripts']);
});

gulp.task('watch', ['scripts', 'styles:watch', 'scripts:watch']);
gulp.task('build', ['scripts']);
