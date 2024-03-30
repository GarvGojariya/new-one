// webpack.config.js

module.exports = {
    // Other webpack configuration options...
    module: {
        rules: [
            // Other rules...
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
        ],
    },
};
