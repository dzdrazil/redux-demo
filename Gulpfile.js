/**
 * Build CSS and JavaScript using `gulp`.
 *
 * Main targets are: `js`, `css` and `watch`.
 *
 * Run with `--production` to get minified sources.
 */

'use strict';

var argv = require('yargs').argv;

var path       = require('path');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var gulpif     = require('gulp-if');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var watchify   = require('watchify');
var babelify   = require('babelify');
var uglify     = require('gulp-uglify');
var sass       = require('gulp-sass');
var minifyCSS  = require('gulp-minify-css');
var plumber    = require('gulp-plumber');

// Directory where static files are found. Don't forget the slash at the end.
var clientDirectory = './client/';
var assetDirectory = './assets/';
var cssDirectory = assetDirectory + 'css';

var sassDirectory = path.join(__dirname, 'sass');
var sassFiles = path.join(sassDirectory, '**/*.scss');

  // Source and target JS files for Browserify
var jsMainFile      = clientDirectory + 'index.jsx';
var jsBundleFile    = 'bundle.js';
var jsDirectory = assetDirectory + 'js';

  // Source and target LESS files
// var cssMainFile     = sassDirectory + 'screen.scss';
// var cssFiles        = staticDirectory + 'less/**/*.less';

// Browserify bundler, configured for reactify with sources having a .jsx extension
var bundler = browserify({
  entries: [jsMainFile],
  transform: [babelify],
  extensions: ['.jsx'],
  debug: !argv.production,
  cache: {}, packageCache: {}, fullPaths: true // for watchify
});

// Build JavaScript using Browserify
gulp.task('js', function() {
  return bundler
    .bundle()
    .pipe(source(jsBundleFile))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(gulpif(!argv.production, sourcemaps.init({loadMaps: true}))) // loads map from browserify file
    .pipe(gulpif(!argv.production, sourcemaps.write('./'))) // writes .map file
    .pipe(gulpif(argv.production, uglify()))
    .pipe(plumber.stop())
    .pipe(gulp.dest(jsDirectory));
});

// Build CSS
gulp.task('sass', function () {
  gulp.src(sassFiles)
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(gulpif(argv.production, minifyCSS({keepBreaks:true})))
    .pipe(plumber.stop())
    .pipe(gulp.dest(cssDirectory));
});

// Watch JS + CSS using watchify + gulp.watch

gulp.task('watchify', function() {
  var watcher  = watchify(bundler);
  return watcher
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .on('update', function () {
    watcher.bundle()
      .pipe(source(jsBundleFile))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest(jsDirectory));

    gutil.log("Updated JavaScript sources");
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source(jsBundleFile))
  .pipe(gulp.dest(jsDirectory));
});

gulp.task('sass:watch', ['sass'], function () {
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('watch', ['watchify', 'sass:watch']);
gulp.task('default', ['js', 'sass']);
