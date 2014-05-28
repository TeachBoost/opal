/**
 * Files Page
 */

// dependencies
var win
  , Files
  , ko = require( 'knockout' );

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
    files: []
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
        ModelView.render();
    });

    // sync the received files from the Files library with the
    // locally stored copy in the model-view data
    this.syncFiles = function () {
        ModelView.data.files = Files.getReceivedFiles();
    };
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return FilesPage();
};