// webpack.config.cjs
const path = require('path');

module.exports = {
    entry: './js/main.js',  // Точка входа для клиентских скриптов
    output: {
        filename: 'bundle.js',  // Имя выходного файла
        path: path.resolve(__dirname, 'dist'), // Папка, куда будет помещён выходной файл
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Для всех .js файлов
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Используем Babel для транспиляции
                    options: {
                        presets: ['@babel/preset-env'], // Пресеты для Babel
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'], // Автоматически разрешать .js файлы
    },
    devtool: 'source-map', // Генерация source maps
    mode: 'development', // Режим разработки
};
