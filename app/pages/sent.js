/**
 * Sebt Files Page
 */

// dependencies
var win
  , Files
  , Util
  , _ = require( 'underscore' );

module.exports = function ( _win ) {
    win = _win;
};

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/sent.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    // activate nav page
    navPage: 'sent',
    // whether or not the nav is enabled
    navEnabled: true,
    // whether the admin page is enabled
    adminEnabled: false,
    // container for files sent to this user
    files: [],
    // whether or not the scrollbar is visible for
    // the files table
    scrollEnabled: false
};

// set up the model events
ModelView.events = {
    // change page event
    navClick: function ( event, page ) {
        if ( page !== this.navPage ) {
            win.emit( page + '.show' );
        }
    }
};

// library
var SentPage = function () {
    var self = this;
    // render the sent files page
    win.on( 'sent.show', function () {
        // set flags
        ModelView.data.adminEnabled = Util.flags.admin;
        // get the files; emits an event when done
        Files.getSentFiles();
        // teardown the ractive bindings first
        // render the page
        ModelView.render( function () {
            // trigger this on render
            self.updateScroller();
        });
    });

    // when the window is resized, we need to adjust
    // the files table scrollbars.
    win.on( 'resize', function ( width, height ) {
        self.updateScroller();
    });

    // log a sent file
    win.on( 'sent.log', function ( meta ) {
        Files.logSentFile( meta );
    });

    // when files are loaded, reset the view
    win.on( 'sent.files.loaded', function ( files ) {
        ModelView.data.files = files;
        ModelView.ractive.update( 'files' );
    });

    // gets the window height, and the table's
    // client height to determine if we should shift
    // the table header over to compensate for the
    // table body's scrollbar.
    this.updateScroller = _.throttle( function () {
        var $table = document.getElementById( 'sent-list' );
        if ( ! $table ) return;
        // update the modelview
        ModelView.data.scrollEnabled = $table.scrollHeight > $table.clientHeight;
        ModelView.ractive.update( 'scrollEnabled' );
    }, 250 );
};

// return
module.exports = function ( _win, _Files, _Util ) {
    win = _win;
    Files = _Files;
    Util = _Util;
    return SentPage();
};