'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


  gulp.task('browser-sync', function() {
    browserSync({
      server: {
        baseDir: "./build",
      },
      open: false,
      logConnections: true,
      logSnippet: false
    });
  });

  gulp.task('compile-scss', function(){
    return gulp.src([
        './test/scss/styles.scss'
      ])
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['scss'],
        outputStyle: 'expanded'
      }))
      .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
      .pipe(sourcemaps.write('maps', {
        includeContent: false,
        sourceRoot: './build/css/'
      }))
      .pipe(gulp.dest('./build/css/'));
  });

  gulp.task('compile-handlebars', function () {

    var templateData = JSON.parse(fs.readFileSync('./data/_wvu-forms.json'));

    var options = {
      batch : [
        './test/partials'
      ]
    };

    return gulp.src('./test/index.hbs')
          .pipe(handlebars(templateData, options))
          .pipe(rename('index.html'))
          .pipe(gulp.dest('./build'));
  });

  gulp.task('default',['compile-scss','compile-handlebars','browser-sync'], function(){
    gulp.watch(["./src/*.scss","./test/scss/*.scss"],["compile-scss"]);
    gulp.watch(["./test/**/*.hbs","./test/data.json"],["compile-handlebars"]);
    gulp.watch("./build/**/*.html").on('change',reload);
    gulp.watch("./build/css/*.css").on('change',reload);
  });
