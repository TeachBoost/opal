/**
 * Admin Page
 */

// dependencies
var win
  , ko = require( 'knockout' );

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/admin.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    // activate nav page
    navPage: 'admin',
    // whether the nav is disabled
    navDisabled: function () {
        return false;
    },
    // change page event
    navClick: function ( page ) {
        win.emit( page + '.show' );
    },
    // open the dev tools
    openDevTools: function () {
        win.showDevTools();
    }
};

// library
var AdminPage = function () {
    // render the error page
    win.on( 'admin.show', function () {
        ModelView.render();
        ModelView.activate();
    });
};

// return
module.exports = function ( _win ) {
    win = _win;
    return AdminPage();
};