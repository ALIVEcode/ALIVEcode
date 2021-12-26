const path = require("path");
const webpack = require('webpack')

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'index.bundle.js',
		sourceMapFilename: '[name].js.map',
	},
	devServer: {
		port: 3000,
		hot: 'only',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
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
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],
	devtool: 'source-map',
	target: 'web',
};