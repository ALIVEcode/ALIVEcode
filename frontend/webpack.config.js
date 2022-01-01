const path = require("path");
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const isDevelopment = !isProduction;

	return {
		entry: './src/index.tsx',
		output: {
			path: path.join(__dirname, '/dist'),
			filename: 'index.bundle.js',
		},
		devServer: {
			port: 3000,
			hot: true,
			historyApiFallback: true,
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							cacheCompression: false,
							envName: isProduction ? 'production' : 'development',
						},
					},
				},
				{
					test: /\.css$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'postcss-loader',
					],
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.md$/,
					use: 'raw-loader',
				},
				{
					test: /\.m?js/,
					resolve: {
						fullySpecified: false,
					},
				},
			],
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			fallback: {
				os: false,
				fs: false,
				tls: false,
				net: false,
				path: false,
				zlib: false,
				http: false,
				https: false,
				stream: false,
				crypto: false,
			},
		},
		plugins: [
			isProduction &&
				new MiniCssExtractPlugin({
					filename: 'styles.css',
				}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(
					isProduction ? 'production' : 'development',
				),
			}),
			new webpack.ProvidePlugin({
				process: 'process/browser',
			}),
			new Dotenv({
				path: './.env',
			}),
		].filter(Boolean),

		devtool: isDevelopment && 'source-map',
		target: 'web',
	};
};