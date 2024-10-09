const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {resolve} = require('node:path');

module.exports = {
    profile: true,
    entry: slsw.lib.entries,
    target: 'node20',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    externals: [nodeExternals()],
    stats: 'errors-only',
    devtool: 'source-map',
    cache: {
        type: 'filesystem', // Persistent cache stored on the file system
        cacheDirectory: resolve(__dirname, '.webpack_cache'), // Custom cache directory
        buildDependencies: {
            config: [__filename], // Caches the Webpack config file
        },
    },
    optimization: {
        moduleIds: 'deterministic',
        minimize: !slsw.lib.webpack.isLocal,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    keep_classnames: true, // Prevents renaming class names
                    keep_fnames: true,     // Prevents renaming function names
                    ecma: 2020,
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: __dirname,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: resolve(__dirname, 'tsconfig.json'),
                            transpileOnly: false, // Optional: For performance, disables type-checking during Webpack build
                            compilerOptions: {
                                sourceMap: true, // Enable source maps in ts-loader
                            }
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Add `.ts` for TypeScript support
        alias: {
            '@schemas': resolve(__dirname, 'src/schemas'),
            '@handlers': resolve(__dirname, 'src/handlers'),
            '@models': resolve(__dirname, 'src/models'),
            '@repos': resolve(__dirname, 'srcrepos'),
            '@utils': resolve(__dirname, 'src/utils')
        },
    },
    plugins: [new ForkTsCheckerWebpackPlugin()]

};
