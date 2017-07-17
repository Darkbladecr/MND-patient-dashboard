'use strict';
var webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

var SRC = __dirname + '/src';
var DIST = __dirname + '/build';

var config = {
	context: SRC,
	devtool: 'eval',
	devServer: {
		contentBase: SRC,
		port: 3000,
		historyApiFallback: true,
		stats: 'minimal',
		proxy: {
			'/api': { target: 'http://localhost:8080', changeOrigin: true },
			'/graphql': { target: 'http://localhost:8080', changeOrigin: true },
			'/images': { target: 'http://localhost:8080', changeOrigin: true },
		},
	},
	entry: {
		app: path.join(SRC, 'app/index.module.js'),
	},
	output: {
		path: DIST,
		filename: '[name].js',
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module) {
				return (
					module.context &&
					module.context.indexOf('node_modules') !== -1
				);
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity,
		}),
		new ExtractTextPlugin('[name].css'),
		new HtmlWebpackPlugin({
			template: path.join(SRC, 'index.ejs'),
		}),
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader?url=false', 'sass-loader'],
				}),
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader?url=false'],
				}),
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'file-loader',
			},
			{
				test: /\.(svg|woff|woff2|[ot]tf|eot)/,
				loader: 'file-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules|bower_components/,
				loader: 'babel-loader',
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
			{
				test: /\.html$/,
				use: [
					'html-loader',
					{
						loader: 'html-minify-loader',
						options: {
							empty: false,
							comments: false,
						},
					},
				],
			},
			{
				test: /\.ejs$/,
				loader: 'ejs-compiled-loader',
			},
		],
		noParse: [/node_modules\/leveldown/, /acron\/dist/],
	},
	target: 'electron-renderer',
	node: {
		__filename: false,
		__dirname: false,
	},
};

if (process.env.NODE_ENV === 'production') {
	config.devtool = 'cheap-module-source-map';
	config.plugins.push(
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		})
	);
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true,
			},
			compress: {
				screw_ie8: true,
				warnings: false,
			},
			comments: false,
		})
	);
} else {
	config.devtool = 'cheap-module-eval-source-map';
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.output.filename = '[name].js';
}

module.exports = config;
