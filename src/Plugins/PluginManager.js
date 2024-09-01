/**
 * Plugins/PluginManager.js
 *
 * Plugin Manager - Load and execute plugins
 * Plugins have to be globals, can not be server specific (multiple server in one clientinfo)
 * You alter memory, so you can't restore it if you change server.
 *
 * It's a work in progress, and subject to changes.
 *
 * To add plugins use the "plugins" param to list plugins in the ROBrowser Config. Plugins must be located in the /Plugin/ folder.
 *
 * Usage:
 * 		plugins:
 * 		[
 * 			'<path/to/plugin1>',
 * 			{ name: 'plugin2', path: '<path/to/plugin2>' },
 * 			{ name: 'plugin3', path: '<path/to/plugin3>', params: [ 'param1', 'param2' ] },
			...
 *		]
 *
 * Example:
 * 		plugins:		[ 'KeyToMove_v1/KeyToMove' ],
 *
 *
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(function( require )
{
	'use strict';


	/**
	 * Plugins are loaded from configs
	 */
	var Configs = require('Core/Configs');


	/**
	 * Plugin namespace
	 */
	var Plugins = {};


	/**
	 * @var {Array} plugin list
	 */
	Plugins.list = [];


	/**
	 * Initialize plugins
	 */
	Plugins.init = function init( context )
	{
		this.list = Configs.get( 'plugins', [] );

		this.list.forEach( plugin =>
		{
			let module = null;
			let name = '';
			let params = [];

			// Only Path is provided as string
			if( typeof plugin === 'string' || plugin instanceof String )
			{
				name = ( plugin.split( /[\\/]/ ).pop() ).split( /\./ ).pop();
//				module = require( './' + plugin );
			}
			// Path and parameters are provided as well
			else if( typeof plugin === 'object' && plugin !== null )
			{
				if( !plugin.path ) return;

				name = plugin.name;
//				module = require( './' + plugin.path );

				if( Array.isArray( plugin.params ) )
				{
					params = plugin.params;
				}
			}

			if( module )
			{
				let instance = module( ...params );

				if( instance ) console.log( '[PluginManager] Initialized plugin: ' + name );
				else console.error( '[PluginManager] Failed to initialize plugin: ' + name );
			}
		} );
	};


	/**
	 * Export
	 */
	return Plugins;
});
