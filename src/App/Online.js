/**
 * App/Online.js
 *
 * Start roBrowser
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

/// <reference types="webpack/module" />
const WebPackLoadChunk = __webpack_chunk_load__;
__webpack_chunk_load__ = async ( id ) =>
{
	let error;
	try
	{
		return await WebPackLoadChunk( id );
	}
	catch( exception )
	{
		error = exception;

		require( ['UI/Components/Error/Error'], function( Errors )
		{
			Errors.addTrace( error );
		} );
	}

	throw error;
};

require(
	['Engine/GameEngine', 'Core/Context', 'Plugins/PluginManager'],
	function(GameEngine,        Context,           Plugins) {
		'use strict';

		Plugins.init();
		GameEngine.init();

		window.onbeforeunload = function() {
			return 'Are you sure to exit roBrowser ?';
		};
	}
);
