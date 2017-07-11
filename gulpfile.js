var jsonminify = require('gulp-jsonminify');
var cleanCSS = require('gulp-clean-css');
var gulp = require('gulp');
 
gulp.task('minify', function () {
    return gulp.src(['public/model/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('public/dist/'));
});


gulp.task('minify-css', () => {
  return gulp.src(['public/css/*.css'])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dist/'));
});