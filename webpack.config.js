// webpack.config.js

import path from "path";

export const module = {
    rules: [
        {
            test: /\.html$/,
            use: "html-loader",
        },
    ],
    externals: Object.fromEntries(
        fs
            .readdirSync("node_modules")
            .filter((x) => x !== "bin")
            .map((x) => [x, "commonjs " + x])
    ),
};
