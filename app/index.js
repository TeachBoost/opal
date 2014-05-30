/**
 * Opal Application Bootstrap
 *
 * Load all of our required Model-Views and set up
 * the window events.
 */

// set up path globals
var APP_PATH = './app';

// get the window object and dependencies
var gui = require( 'nw.gui' )
  , win = gui.Window.get()
  , _ = require( 'underscore' );

// load the app modules
var Util = require( APP_PATH + '/library/util.js' )
  , Crypto = require( APP_PATH + '/library/crypto.js' )( win )
  , Files = require( APP_PATH + '/library/files.js' )( win, gui )
  , Menu = require( APP_PATH + '/library/menu.js' )( win, gui )
  , Message = require( APP_PATH + '/library/message.js' )( win );

// load the pages
// each page has a window dependency that it attaches
// events to.
var ErrorPage = require( APP_PATH + '/pages/error.js' )( win )
  , AdminPage = require( APP_PATH + '/pages/admin.js' )( win )
  , FilesPage = require( APP_PATH + '/pages/files.js' )( win, Files )
  , SettingsPage = require( APP_PATH + '/pages/settings.js' )( win, Files );

// attach the menubar
win.menu = Menu.menubar();

// expose the document globally
global.document = window.document;

// load the config file async
Files.loadConfig();

// listen for load events
// all flags need to be raised before the app is run
// check the config to see if we can bypass anything
var flags = {
    'crypto.enabled' : ( _.isNull( Files.userId ) ? null : true ),
    'crypto.friends' : ( _.isNull( Files.friends ) ? null : true )
};

// app loading. called when flags are all raised.
var run = _.once( function ( err ) {
    // if there are any false flags, show the error page
    if ( err ) return;

    // if there's any problems with the config, show the
    // settings page
    if ( ! Files.hasShareDir() ) {
        win.emit( 'settings.show' );
    }
    // no issues, show the files page
    else {
        win.emit( 'files.show' );
    }
});

// once all of our flags have been raised we need to either
// error handle or run the main application.
win.on( 'app.load', function ( flag, status ) {
    flags[ flag ] = status;
    // if there are any null flags, return
    var nonNull = _.without( _.values( flags ), null );
    if ( nonNull.length < _.values( flags ).length )
        return;
    // all flags raised, run app
    var err = _.without( _.values( flags ), true ).length;
    run( err );
});

// crypto library emits events since exec calls are
// async. we need to listen for these events. we're
// passing in the flag to tell the crypto library if it
// should run these tasks in the background or foreground.
Crypto.enabled( flags[ 'crypto.enabled' ] );
Crypto.friends( flags[ 'crypto.friends' ] );

// show the window
win.show();