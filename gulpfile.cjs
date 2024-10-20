const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function () {
    return gulp.src('./styles/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('./styles/styles.scss', gulp.series('sass'));
});
