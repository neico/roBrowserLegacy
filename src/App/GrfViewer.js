/**
 * App/GrfViewer.js
 *
 * Start GRF Viewer instance using ROBrowser
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
	['UI/Components/GrfViewer/GrfViewer', 'Core/Context'],
	function( GRFViewer, Context )
{
	'use strict';

	GRFViewer.append();

	window.onbeforeunload = function() {
		return 'Are you sure to exit ?';
	};
});
