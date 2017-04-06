module.exports = {
    entry: './js/app',

    output: {
        filename: './js/bundle.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader" }
        ]
    }
};