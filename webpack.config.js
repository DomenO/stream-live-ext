const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        background: "./src/background/index.ts",
        popup: "./src/popup/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: 'public'}
            ]
        }),
    ],
};