const webpack = require('webpack');

module.exports = {
    resolve:{
        extensions: [ '.ts', '.js' ],
        fallback: {
            "assert": require.resolve("assert/"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer"),
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "crypto-browserify": require.resolve('crypto-browserify'),
        }
    },
    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
}