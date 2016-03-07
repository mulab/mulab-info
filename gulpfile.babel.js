'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const src = ['index.js', 'route.js', 'config.js', 'lib/**/*.js', 'routes/**/*.js'];
const testSrc = ['test/**/*.js'];
const srcOption = { base: './' };
const dest = './dist'

gulp.task('lint', () => {
  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['clean', 'lint'], () => {
  return gulp.src(src, srcOption)
    .pipe(sourceMaps.init())
    .pipe(babel())
    .pipe(sourceMaps.write('.', { includeContent: false, sourceRoot: '..' }))
    .pipe(gulp.dest(dest));
});

gulp.task('clean', () => {
  return gulp.src(dest, {read: false})
    .pipe(clean());
});

gulp.task('test', () => {
  return gulp.src(testSrc, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});
