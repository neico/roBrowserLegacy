/**
 * App/EffectViewer.js
 *
 * Show Str file effect
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
  ['Core/Configs', 'Core/Thread', 'Core/Context', 'Core/Client', 'UI/Components/EffectViewer/EffectViewer'],
  function( Configs,        Thread,        Context,        Client,                           EffectViewer ) {
    'use strict';

    function onAPIMessage( event ) {
      if (typeof event.data !== 'object') {
        return;
      }

      switch (event.data.type) {
        case 'init':
          Thread.delegate( event.source, event.origin );
          Thread.init();
          EffectViewer.append();
          break;

        case 'load':
          EffectViewer.loadEffect(event.data.data);
          event.stopPropagation();
          break;

        case 'stop':
          EffectViewer.stop();
          event.stopPropagation();
          break;
      }
    }

    // Resources sharing
    if (Configs.get('API')) {
      window.addEventListener('message', onAPIMessage, false);
      return;
    }

    // Wait for thread to be ready and run the effectviewer
    Thread.hook('THREAD_READY', function(){
      Client.onFilesLoaded = function(){
        EffectViewer.append();
      };
      Client.init([]);
    });
    Thread.init();

  });
