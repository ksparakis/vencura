const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/handler.ts',
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'handler.js',
        path: path.resolve(__dirname, '.webpack'),
        libraryTarget: 'commonjs',
    },
};
