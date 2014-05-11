/**
 * Settings Page
 */

// dependencies
var win
  , Files = require( '../library/files.js' );

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/settings.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    shareDir: null
};

// library
var SettingsPage = function () {
    // render the error page
    win.on( 'settings.show', function () {
        ModelView.data.shareDir = Files.shareDir;
        ModelView.render();
        ModelView.activate();
    });
};

// return
module.exports = function ( _win ) {
    win = _win;
    return SettingsPage();
};