'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');

const reload = browserSync.reload;
const config = require('./config/config');

gulp.task('sass', () => {
  gulp.src('./public/scss/*.scss')
    .pipe(sourcemaps.init().on('error', gutil.log))
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./').on('error', gutil.log))
    .pipe(gulp.dest('./public/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('watch', () => {
  gulp.watch('./public/scss/*.scss', ['sass']);
});

gulp.task('browser-sync', () => {
  browserSync.init(null, {
    proxy: `http://localhost:${config.server.port}`,
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
  });
});

gulp.task('develop', () => {
  nodemon({
    script: 'app.js',
    ext: 'js pug',
    env: { NODE_ENV: 'development' },
    stdout: false,
    // eslint-disable-next-line func-names
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/^App listening on/.test(chunk)) {
        reload();
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch',
  'browser-sync',
]);
