'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var handlebars = require('gulp-compile-handlebars');
var flatmap = require('gulp-flatmap');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');

// Paths
var jsFiles = ['./assets/js/**/*.js', '!./assets/js/global*.js']; // ! ignores output files (avoid infinite loop)
var jsDest = './docs/js';
var jsEntry = './assets/js/main.js';
var cssFiles = './assets/sass/**/*.scss';
var cssRoot = './assets/sass/style.scss';
var cssDest = './docs/css';
var buildDest = './docs';
// All template files to watch
var templateFiles = './views/**/*.hbs';
// Templates to compile to html
var templateCompileFiles = ['./views/**/*.hbs', '!./views/partials/*.hbs', '!./views/layouts/*.hbs'];
// data for precompiling templates
var templateData = require('./data.json');

gulp.task('styles', function() {
	sass(cssRoot, {sourcemap: true, style: 'compressed'})
	.pipe(autoprefixer("last 2 versions"))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(cssDest));
});

gulp.task('templates', function() {
    return gulp.src(templateCompileFiles)
        .pipe(flatmap(function(stream, file){

        var options = {
            batch: ['./views/partials']
        };

        return gulp.src(file.path)
            //compile each file
            .pipe(handlebars(templateData, options))
            .pipe(rename(file.relative.split('.')[0] + '.html'))

        }))
        .pipe(gulp.dest(buildDest));
});


gulp.task('scripts', function() {
  var customOpts = {
    entries: jsEntry,
    debug: true
  };
  var b = browserify(customOpts);
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('global.min.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
       .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(jsDest));
});

// watch for changes
gulp.task('watch', function () {
  gulp.watch(jsFiles, ['scripts']);  
  // watch sass files
  gulp.watch(cssFiles, ['styles']);
  // wach templates
  gulp.watch(templateFiles, ['templates']);
});

gulp.task('build', ['scripts', 'styles', 'templates']);

gulp.task('default', ['build']);