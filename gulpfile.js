/** gulpfile.js
* Author: Juan Roa, CreaDev.co
* Copyright (C) 2016 Juan Roa
* Version 1.5.0
* Author URL: http://juanroa.me
* Free to use and distribute under the MIT License
* https://opensource.org/licenses/MIT
*/

var gulp = require("gulp");
// Requires the gulp-sass plugin
//var sass = require("gulp-ruby-sass");
// Requires browser-sync package for automatic browser refresh
var browserSync = require("browser-sync");
// Requires run-sequence to avoid concurrency in some tasks...
var runSequence = require('run-sequence');
//requires htmlmin
//var htmlmin = require('gulp-htmlmin');

/**
* Compile with gulp-ruby-sass
*/

gulp.task("sass", function () {
  console.log("compiling scss")
  return sass("app/scss/style.scss")
  .on("error", sass.logError)
  // Writes converted css to dest url
  .pipe(gulp.dest("app/css"))
  .pipe(browserSync.stream({match: "dist/*.css"}))
});

/*
 * PHP gulp-server - unoptimized...
*/
// var php = require('gulp-connect-php');

// gulp.task('php', function() {
//   php.server({}, function (){
//     browserSync({
//       hostname: 'localhost',
//       port: 8001,
//       base: 'dist'
//     });
//   });

// });

/*
* Static Server + watching scss/html files
*/
gulp.task("serve", function() {
  browserSync({
    server: {
      baseDir: "dist"
    },
  })
});

gulp.task("watch", function(){
  /**
  * Listens changes for all .html files and reloads the browser
  * In the case of spanish html files, it executes de min task before.
  */
  gulp.watch("app/*.html", ["min", browserSync.reload]);
  /**
  * Listens changes for all .scss files and runs the sass and min tasks
  * also, it reloads the browser after that.
  */
  gulp.watch("app/scss/*.scss", ["sass", browserSync.reload]);
  gulp.watch("app/scss/*.scss", ["min", browserSync.reload]);
  /**
  * Listens changes for all english .html files and runs the en task
  */
  gulp.watch("app/en/*.html", ["en", browserSync.reload]);
  /**
  * Listens changes for all .php files and reloads the browser
  * In the case of spanish html files, it executes de minphp task before.
  */
  gulp.watch('app/*.php', ["minphp", browserSync.reload]);
  /**
  * Listens changes for all english .php files and runs the en task
  */
  gulp.watch('app/en/*.php', ["enphp", browserSync.reload]);

});

gulp.task('x', function(callback) {
  runSequence('serve', 'watch', callback);
});


// Autoprefixes style.css

// var autoprefixer = require('gulp-autoprefixer');

gulp.task('autoprefixer', function () {
  return gulp.src('app/css/style.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions', 'ie 9'],
    cascade: false
  }))
  .pipe(gulp.dest('dist'));
});


/*
 * Optimizes images with gulp-imagemin
*/
var imagemin = require('gulp-imagemin');

gulp.task('images', function(){
  return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/assets/images'))
});

/*
 * CSS and JS minification and concatenation for html
 */
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

gulp.task('minify', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('min', function(){
  return gulp.src('app/*.html')
  .pipe(useref())
  // Minifies only if it's a JS file
  .pipe(gulpIf('*.js', uglify({mangle: false})))
  // Minifies only if it's a CSS file
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true, removeComments: true})))
  .pipe(gulp.dest('dist'))
});

// It just copies the english html files to dist
gulp.task('en', function(){
  return gulp.src('app/en/*.html')
  .pipe(useref())
  .pipe(gulp.dest('dist/en'))
});


// Copying fonts to dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})