"use strict";

/* eslint-env node */

const webpack = require( 'webpack' );
const path = require( 'path' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const HtmlWebpackHarddiskPlugin = require( 'html-webpack-harddisk-plugin' );

const Project = require( './package.json' );
const CurrentPath = path.resolve( __dirname );
const SourcePath = path.resolve( __dirname, 'src' );
const OutputPath = path.resolve( __dirname, 'dist' );

var config_html =
{
	chunks: ['Online'],
	inject: 'body',
	alwaysWriteToDisk: true,
	title: `${Project.name} [${Project.version} - ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}]`,
	meta: {
		charset: { charset: 'utf-8' },
		viewport: 'initial-scale=1.0, user-scalable=no'
	},
	filename: 'index.html',
	// ToDo: move into a file instead...
	// ToDo: use different template depending on build mode
	templateContent: ( { htmlWebpackPlugin } ) =>
		'<!DOCTYPE html>' + '\n' +
		'<html>' + '\n' +
		'\t' +	'<head>' + '\n' +
		'\t\t' +	'<title>' + htmlWebpackPlugin.options.title + '</title>' + '\n' +
		'\t' +	'</head>' + '\n' +
		'\t' +	'<body>' + '\n' +
		'\t\t' +	'<div id="app"></div>' + '\n' +
		'\t\t' +	'<script>' + '\n' +
		'\t\t\t' +		'window.addEventListener( \'load\', function( hEvent )' + '\n' +
		'\t\t\t' +		'{' + '\n' +
		'\t\t\t\t' +		'window.ROConfig =' + '\n' +
		'\t\t\t\t' +		'{' + '\n' +
		'\t\t\t\t\t' +			'target:					document.getElementById( \'app\' ),' + '\n' +
		'\t\t\t\t\t' +			'type:					2,' + '\n' +
		'\t\t\t\t\t' +			'application:			1,' + '\n' +
		'\t\t\t\t\t' +			'width:					document.body.clientWidth,' + '\n' +
		'\t\t\t\t\t' +			'height:					document.body.clientHeight,' + '\n' +
		'\t\t\t\t\t' +			'remoteClient:			\'https://grf.robrowser.com\',' + '\n' +
		'\t\t\t\t\t' +			'development:			false,' + '\n' +
		'\t\t\t\t\t' +			'servers:' + '\n' +
		'\t\t\t\t\t' +			'[' + '\n' +
		'\t\t\t\t\t\t' +			'{' + '\n' +
		'\t\t\t\t\t\t\t' +				'display:		\'Local Server\',' + '\n' +
		'\t\t\t\t\t\t\t' +				'desc:			\'Local Server\',' + '\n' +
		'\t\t\t\t\t\t\t' +				'address:		\'127.0.0.1\',' + '\n' +
		'\t\t\t\t\t\t\t' +				'port:			6900,' + '\n' +
		'\t\t\t\t\t\t\t' +				'version:		1,' + '\n' +
		'\t\t\t\t\t\t\t' +				'langtype:		12,' + '\n' +
		'\t\t\t\t\t\t\t' +				'packetver:		20211103,' + '\n' +
		'\t\t\t\t\t\t\t' +				'socketProxy:	\'wss://connect.robrowser.com\',' + '\n' +
		'\t\t\t\t\t\t\t' +				'adminList:		[2000000]' + '\n' +
		'\t\t\t\t\t\t' +			'},' + '\n' +
		'\t\t\t\t\t' +			'],' + '\n' +
		'\t\t\t\t' +		'};' + '\n' +
		'\t\t\t' +		'} );' + '\n' +
		'\t\t' +	'</script>' + '\n' +
		'\t' +	'</body>' + '\n' +
		'</html>' + '\n',
	templateParameters: {
	}
};

const config =
{
	mode: 'development',
	context: CurrentPath,
	entry:
	{
		EffectViewer:		{ import: './src/App/EffectViewer.js', dependOn: 'ThreadEventHandler' },
		GrannyModelViewer:	{ import: './src/App/GrannyModelViewer.js', dependOn: 'ThreadEventHandler' },
		GrfViewer:			{ import: './src/App/GrfViewer.js', dependOn: 'ThreadEventHandler' },
		MapViewer:			{ import: './src/App/MapViewer.js', dependOn: 'ThreadEventHandler' },
		ModelViewer:		{ import: './src/App/ModelViewer.js', dependOn: 'ThreadEventHandler' },
		StrViewer:			{ import: './src/App/StrViewer.js', dependOn: 'ThreadEventHandler' },
		Online:				{ import: './src/App/Online.js', dependOn: 'ThreadEventHandler' },
		ThreadEventHandler:	{ import: './src/Core/ThreadEventHandler.js' }
	},
	output:
	{
		clean: true,
		path: OutputPath,
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: 'webpack/[chunkhash:8].chunk.js'
	},
	module:
	{
		rules:
		[
			{
				oneOf:
				[
					{
						resourceQuery: /raw/,
						type: 'asset/source',
					},
					{
						test: /\.(jpg|gif|png|svg)$/,
						type: 'asset/inline'
					},
					{
						test: /\.css$/,
						use:
						[
							'style-loader',
							'css-loader'
						]
					}
				]
			}
		]
	},
	devtool: 'inline-source-map',
	devServer:
	{
		static: CurrentPath
	},

	plugins:
	[
		new CopyPlugin(
		{
			patterns:
			[
				{ from: 'AI', to: 'AI' }
			],
		} ),
		new HtmlWebpackHarddiskPlugin(
		{
			outputPath: OutputPath
		} )
	],

	optimization:
	{
		runtimeChunk: 'single',
		splitChunks:
		{
			cacheGroups:
			{
				vendor:
				{
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},

	resolve:
	{
		modules:
		[
			SourcePath,
			'node_modules'
		],
		alias:
		{
			text: 'Vendors/text.require',
			jquery: 'Vendors/jquery-1.9.1'
		}
	},
	resolveLoader:
	{
		alias: { 'text': 'html-loader' }
	},
	amd:
	{
		jQuery: true
	}
};

module.exports = ( env, args ) =>
{
	config.mode = !env ? 'development' : args.mode;

	if( args.mode === 'production' )
	{
		config.devtool = 'source-map';
	}

	config.optimization.minimize = env.minify ? env.minify : false;
	config_html.minify = env.minify ? env.minify : false;

	if( env.bundle )
	{
		config.output.chunkLoading = false;
	}

	config.plugins.push( new HtmlWebpackPlugin( config_html ) );

	return config;
};
