const path = require('path');

module.exports = {
    entry: './js/userList.js',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
