const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('.env')) {
	try {
		fs.copyFile('.env.example', '.env', (err) => {
			if (err) throw err;
		});
	} catch (err) {
		fs.writeFile('.env', '', (err) => {
			if (err) throw err;
		});
	} finally {
		console.log('Environment file is created ".env"');
	}
}

const pages = require('./configs/pages.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const ESLintPlugin = require('./configs/eslint.config');
const HtmlTemplates = require('./configs/templates.config');
const PrettierPlugin = require('./configs/prettier.config');

const isProduction = process.env.NODE_ENV == 'production';

// "http" | "https" | "spdy"
const serverType = 'http';

const stylesHandler = isProduction
	? MiniCssExtractPlugin.loader
	: 'style-loader';

const assets = ['docs', 'icons', 'fonts', 'images', 'videos'];

assets.forEach((asset) => {
	if (!fs.existsSync(__dirname + '/assets/' + asset)) {
		fs.mkdirSync(__dirname + '/assets/' + asset, { recursive: true });
		console.info('Creating assets/' + asset);
	}
});

const dotenv = require('dotenv').config({
	path: path.join(__dirname, '.env')
});

const config = {
	entry: pages.reduce(
		(entries, page) => {
			if (fs.existsSync(`${page.path}/${page.pageName}.js`)) {
				entries[page.pageName] = `./${page.path}/${page.pageName}.js`;

				return entries;
			}

			return 'src/templates/main/main.js';
		},
		{ app: './src/js/app.js' }
	),

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].js'
	},

	stats: {
		preset: 'minimal',
		assets: false,
		modules: false,
		colors: true
	},

	performance: {
		maxAssetSize: 2097152
	},

	devServer: {
		hot: true,
		open: true,
		compress: true,
		port: 3000,
		allowedHosts: 'auto',
		client: {
			progress: true
		},
		static: {
			directory: path.join(__dirname, 'assets')
		},
		server: {
			type: serverType ?? 'http'
		}

		// http://localhost:3000/webpack-dev-server for more information
	},

	optimization: {
		usedExports: true,
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
	},

	plugins: [
		...HtmlTemplates,
		PrettierPlugin,
		ESLintPlugin,
		new CleanWebpackPlugin(),
		new webpack.ProgressPlugin(),
		new webpack.DefinePlugin({
			'process.env': dotenv.parsed
		}),
		new FaviconsWebpackPlugin({
			logo: path.resolve(__dirname, 'assets/icons/favicon.png'),
			cache: true,
			inject: true
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'assets/icons/*', to: 'icons', noErrorOnMissing: true },
				{ from: 'assets/docs/*', to: 'docs', noErrorOnMissing: true },
				{ from: 'assets/fonts/*', to: 'fonts', noErrorOnMissing: true },
				{
					from: 'assets/videos/*',
					to: 'videos',
					noErrorOnMissing: true
				}
			]
		}),
		new webpack.optimize.MinChunkSizePlugin({
			minChunkSize: 10000
		})

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/i,
				loader: 'babel-loader'
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					stylesHandler,
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(
									__dirname,
									'./configs/postcss.config.js'
								)
							}
						}
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset'
			}

			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		]
	}
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';

		config.plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].css'
			})
		);
	} else {
		config.mode = 'development';
	}
	return config;
};
