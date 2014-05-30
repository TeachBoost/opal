/**
 * Admin Page
 */

// dependencies
var win;

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
    // whether admin is enabled
    adminEnabled: true,
    // whether the nav is disabled
    navEnabled: true
};

// set up the model events
ModelView.events = {
    // change page event
    navClick: function ( event, page ) {
        if ( page !== this.navPage ) {
            win.emit( page + '.show' );
        }
    },
    // open the dev tools
    openDevTools: function () {
        win.showDevTools();
    }
}

// library
var AdminPage = function () {
    // render the error page
    win.on( 'admin.show', function () {
        ModelView.render();
    });
};

// return
module.exports = function ( _win ) {
    win = _win;
    return AdminPage();
};