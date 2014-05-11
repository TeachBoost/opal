/**
 * Settings Page
 */

// dependencies
var win;
// include libraries
var ModelView = require( '../library/modelview.js' )(
    './app/views/settings.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// library
var SettingsPage = function () {
    // render the error page
    win.on( 'settings.show', function () {
        ModelView.render();
        ModelView.activate();
    });
};

// return
module.exports = function ( _win ) {
    win = _win;
    return SettingsPage();
};