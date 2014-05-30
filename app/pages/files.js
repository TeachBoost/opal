/**
 * Files Page
 */

// dependencies
var win
  , Files
  , _ = require( 'underscore' );

module.exports = function ( _win ) {
    win = _win;
};

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/files.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    // activate nav page
    navPage: 'files',
    // whether or not the nav is enabled
    navEnabled: true,
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
var FilesPage = function () {
    var self = this;
    // render the error page
    win.on( 'files.show', function () {
        // get the files
        self.syncFiles();
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

    // sync the received files from the Files library with the
    // locally stored copy in the model-view data
    this.syncFiles = function () {
        ModelView.data.files = Files.getReceivedFiles();
    };

    // gets the window height, and the table's
    // client height to determine if we should shift
    // the table header over to compensate for the
    // table body's scrollbar.
    this.updateScroller = _.throttle( function () {
        var $table = document.getElementById( 'files-list' );
        ModelView.data.scrollEnabled = $table.scrollHeight > $table.clientHeight;
        ModelView.ractive.update( 'scrollEnabled' );
    }, 250 );
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return FilesPage();
};