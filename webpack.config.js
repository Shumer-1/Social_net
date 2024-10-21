import path from "path";
import {fileURLToPath} from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirnamePath = path.dirname(__filename);
const users = JSON.parse(fs.readFileSync(path.join(__dirnamePath, "data/users.json"), "utf8"));
const title = "title";
const allNews = JSON.parse(fs.readFileSync(path.join(__dirnamePath, "data/news.json"), "utf8"));
const friendsNews = allNews.filter(n => users[0].friends && users[0].friends.includes(n.author_id));
const userNews = allNews.filter(n => n.author_id === users[0].id);
const combinedNews = [...userNews, ...friendsNews];
combinedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
const friends = users.filter(u => users[0].friends.includes(u.id));

export default {
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.pug$/,
                loader: "pug-loader",
                options: {
                    pretty: true
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // Вставка стилей в DOM
                    'css-loader',   // Преобразование CSS в CommonJS
                    'sass-loader'   // Компиляция SCSS в CSS
                ]
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            filename: 'editUserTemplate.html',
            template: './pages/editUser.pug',
            inject: 'body',
            chunks: ['main', 'editUserTemplate'],
            templateParameters: {user: users[0]}
        }),

        new HtmlWebpackPlugin({
            filename: 'friendsTemplate.html',
            template: './pages/friends.pug',
            inject: 'body',
            chunks: ['main', 'friendsTemplate'],
            templateParameters: {friends: friends, title: title}
        }),

        new HtmlWebpackPlugin({
            filename: 'friendsNewsTemplate.html',
            template: './pages/friendsNews.pug',
            inject: 'body',
            chunks: ['main', 'friendsNewsTemplate'],
            templateParameters: {news: combinedNews, title: title, users:users, user: users[0]}
        }),

        new HtmlWebpackPlugin({
            filename: 'newUserTemplate.html',
            template: './pages/newUser.pug',
            inject: 'body',
            chunks: ['main', 'newUserTemplate'],
            templateParameters: {title: title}
        }),

        new HtmlWebpackPlugin({
            filename: 'Template.html',
            template: './pages/newUser.pug',
            inject: 'body',
            chunks: ['main', 'userListTemplate'],
            templateParameters: {title: title}
        }),
    ],
    resolve: {
        extensions: ['.js', '.scss', '.pug'],
    },
    devtool: 'source-map',
    mode: 'development',
};
