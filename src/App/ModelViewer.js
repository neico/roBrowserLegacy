/**
 * App/ModelViewer.js
 *
 * Show Gravity models (rsm files)
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
   ['Core/Configs', 'Core/Thread', 'Core/Context', 'Core/Client', 'UI/Components/ModelViewer/ModelViewer'],
function( Configs,        Thread,        Context,        Client,                             ModelViewer ) {
	'use strict';

	function onAPIMessage( event ) {
		if (typeof event.data !== 'object') {
			return;
		}

		switch (event.data.type) {
			case 'init':
				Thread.delegate( event.source, event.origin );
				Thread.init();
				ModelViewer.append();
				break;

			case 'load':
				ModelViewer.loadModel(event.data.data);
				event.stopPropagation();
				break;

			case 'stop':
				ModelViewer.stop();
				event.stopPropagation();
				break;
		}
	}

	// Resources sharing
	if (Configs.get('API')) {
		window.addEventListener('message', onAPIMessage, false);
		return;
	}

	// Wait for thread to be ready and run the modelviewer
	Thread.hook('THREAD_READY', function(){
		Client.onFilesLoaded = function(){
			ModelViewer.append();
		};
		Client.init([]);
	});
	Thread.init();

});
