const htmlPlugin = require("html-webpack-plugin")
const cssPlugin = require("mini-css-extract-plugin")

let mode = process.env.NODE_ENV == "production" ? "production" : "development"

module.exports = {
	mode,
	devServer: {
		static: "./src",
	},
	entry: {
		main: "./src/main.js",
		libs: "./src/libs.js",
	},
	plugins: [
		new cssPlugin(),
		new htmlPlugin({
			template: "./src/index.html",
			filename: "index.html",
			chunks: "all",
		}),
	],
	module: {
		rules: [
			{
				test: /\.(sass|css|scss)$/i,
				use: [
					mode === "production" ? cssPlugin.loader() : "style-loader",
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
}
