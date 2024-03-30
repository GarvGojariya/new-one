/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        dbConfig: {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "root", // @@@
            database: "nextjs",
        },
        secret: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING",
    },
    publicRuntimeConfig: {
        apiUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/api" // development api
                : "http://localhost:3000/api", // production api
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Ignore HTML files from specific modules
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /\.html$/,
                contextRegExp: /@mapbox\/node-pre-gyp/,
            })
        );

        return config;
    },
};

export default nextConfig;
