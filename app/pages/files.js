/**
 * Files Page
 */

// dependencies
var win
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
    navDisabled: function () {
        return false;
    },
    // change page event
    navClick: function ( page ) {
        win.emit( page + '.show' );
    }
};

// library
var FilesPage = function () {
    // render the error page
    win.on( 'files.show', function () {
        ModelView.render();
        ModelView.activate();
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    return FilesPage();
};