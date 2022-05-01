const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

module.exports = (_, argv) => ({
    entry: "./src/App.tsx",
    target: "web",
    mode: argv.mode,
    devtool: argv.mode === "development" ? "source-map" : undefined,
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat"
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../data"),
        publicPath: "",
        clean: true
    },
    optimization: {
        minimize: argv.mode === "production",
        minimizer: [new TerserPlugin({
            extractComments: false,
            terserOptions: {
                format: {
                    comments: false
                }
            }
        })]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader"
            },
            {
                test: /\.scss?$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
            },
            {
                test: /\.css?$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: "Thermometer" }),
        new ESLintWebpackPlugin({ fix: true, extensions: [".ts", ".tsx"] }),
        ...(argv.mode === "production" ? [new CompressionPlugin({ deleteOriginalAssets: true })] : []),
        new webpack.DefinePlugin({
            DEVELOPMENT: argv.mode === "development"
        })
    ]
});
