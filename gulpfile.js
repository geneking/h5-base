var gulp         = require('gulp'),
    concat       = require('gulp-concat'),
    less         = require('gulp-less'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    csslint      = require('gulp-csslint'),
    jshint       = require('gulp-jshint'),
    rename       = require('gulp-rename'),
    //q            = require('q'),
    //rev          = require('gulp-rev'),
    //revcollector = require('gulp-rev-collector'),
    lazypipe     = require('lazypipe');

var compilecss = lazypipe()
    .pipe(less)
    .pipe(csslint)
    .pipe(csslint.reporter);

gulp.task('css', function() {
    //var deferred = q.defer();
    gulp.src(['src/css/*'])
        .pipe(compilecss())
        .pipe(gulp.dest('dist/css'));
        /*.pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'))*/

    gulp.src(['libs/h5-common.less'])
      .pipe(compilecss())
      .pipe(rename('h5-base.css'))
      .pipe(gulp.dest('dist'))
      .pipe(minifycss())
      .pipe(rename('h5-base.min.css'))
      .pipe(gulp.dest('dist'));
    //return deferred.promise;
});

gulp.task('js', function() {
    gulp.src(['libs/zepto.min.js', 'libs/h5-common.js'])
        //.pipe(jshint())
        //.pipe(jshint.reporter())
        .pipe(concat('h5-base.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('h5-base.min.js'))
        .pipe(gulp.dest('dist'));
        /*.pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'))*/

    gulp.src(['src/js/*'])
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
    gulp.src(['src/images/*'])
      .pipe(gulp.dest('dist/images'));
    //return deferred.promise;
});

gulp.task('default', ['css','js', 'images'], function(){
  gulp.watch(['src/css/*.less','libs/*.less'],['css']);
  gulp.watch(['src/js/*.js','libs/*.js'],['js']);
  gulp.watch(['src/images/*'],['images']);
});
