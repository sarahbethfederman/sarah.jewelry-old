'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps'); 
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var flatmap = require('gulp-flatmap');

// Paths
var jsFiles = ['./assets/js/**/*.js', '!./assets/js/global*.js']; // ! ignores output files (avoid infinite loop)
var jsDest = './build/js'; 
var cssFiles = './assets/sass/**/*.scss';
var cssRoot = './assets/sass/style.scss';
var cssDest = './build/css';
var templateFiles = './views/**/*.hbs';
// data for precompileing templates
var templateData = require('./data.json');

gulp.task('lint', function() {
  gulp.src(jsServer)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
	sass(cssRoot, {sourcemap: true, style: 'compressed'})
	.pipe(autoprefixer("last 2 versions"))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(cssDest));
});

// Concat and uglify all public scripts
gulp.task('scripts', function() {
	return gulp.src(jsFiles)
		.pipe(concat('global.js'))
		.pipe(rename('global.min.js'))
		.pipe(uglify().on('error', gulpUtil.log))
		.pipe(gulp.dest(jsDest));
});

// watch for changes
gulp.task('watch', function () {
	// lint node files
	//gulp.watch(jsServer, ['lint']);
	// concat/uglify public js
	gulp.watch(jsFiles, ['scripts']);
	// watch sass files
	gulp.watch(cssFiles, ['styles'])
});

// gulp.task('templates', function(fileName) {
//     var options = {
//         batch: templateFiles
//     };

//     return gulp.src(fileName)
//         .pipe(handlebars(templateData, options))
//         .pipe(rename(fileName.split('.')[0] + '.hbs'))
//         .pipe(gulp.dest('dist'));
// });

gulp.task('templates', function() {
    return gulp.src(templateFiles)
        .pipe(flatmap(function(stream, file){
        
        var options = {
            batch: ['./views/partials']
        };

        return gulp.src(file.path)
            //compile each file
            .pipe(handlebars(templateData, options))
            .pipe(rename(file.stem + '.html'))

        }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['scripts', 'styles', 'templates']);

gulp.task('default', ['build']);