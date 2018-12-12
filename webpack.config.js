const path = require('path');

module.exports = {
    entry: {
        app: [
            "@babel/polyfill",
            './src/index.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    watch: true,
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "babel-loader",
                query: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        "@babel/plugin-proposal-class-properties",
                        [
                            "@babel/plugin-transform-regenerator"
                        ]
                    ]
                }
            }]
        }]
    },
};