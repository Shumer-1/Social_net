import gulp from 'gulp';
import sass from 'gulp-sass';
import sassCompiler from 'sass';

const sassTask = sass(sassCompiler);

export const styles = () => {
    return gulp.src('./styles/styles.scss')
        .pipe(sassTask().on('error', sassTask.logError))
        .pipe(gulp.dest('public/css'));
};

export const watch = () => {
    gulp.watch('./styles/styles.scss', styles);
};
