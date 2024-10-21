import gulp from 'gulp';
import sass from 'gulp-sass';
import sassCompiler from 'sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const sassTask = sass(sassCompiler);
const __filename = fileURLToPath(import.meta.url);
const __dirnamePath = path.dirname(__filename);
const users = JSON.parse(fs.readFileSync(path.join(__dirnamePath, "data/users.json"), "utf8"));
const title = "title";
const allNews = JSON.parse(fs.readFileSync(path.join(__dirnamePath, "data/news.json"), "utf8"));
const friendsNews = allNews.filter(n => users[0].friends && users[0].friends.includes(n.author_id));
const userNews = allNews.filter(n => n.author_id === users[0].id);
const combinedNews = [...userNews, ...friendsNews];
combinedNews.sort((a, b) => new Date(b.date) - new Date(a.date));

export const styles = () => {
    return gulp.src('./styles/styles.scss')
        .pipe(sassTask().on('error', sassTask.logError))
        .pipe(gulp.dest('public/css'));
};

export const scripts = () => {
    return gulp.src('./js/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist/gulp'));
}

export const views = () => {
    return gulp.src('./pages/*.pug')
        .pipe(pug({locals: {users: users, user: users[0], title: title,
                friends: users.filter(u => users[0].friends.includes(u.id)),
                news:combinedNews}}))
        .pipe(gulp.dest('dist/gulp'));
}

export const defaultTask = gulp.series(
    gulp.parallel(styles, scripts, views),
    () => {
        gulp.watch('public/scss/**/*.scss', styles);
        gulp.watch('public/js/**/*.js', scripts);
        gulp.watch(['views/**/*.pug', 'data/**/*.json'], views);
    }
);

export default defaultTask;