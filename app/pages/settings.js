/**
 * Settings Page
 */

// dependencies
var win
  , Files
  , Util;

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/settings.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    // shared folder setting
    shareDir: null,
    // activate nav page
    navPage: 'settings',
    // whether the nav is disabled
    navEnabled: function () {
        return this.shareDir.length > 0;
    },
    // whether the admin page is enabled
    adminEnabled: false
};

// set up the model events
ModelView.events = {
    // open the file dialog
    openDialog: function () {
        var $dialog = document.getElementById( 'shareDirFileInput' );
        $dialog.click();
    },
    // when the file dialog is changed
    changeDir: function () {
        var $dialog = document.getElementById( 'shareDirFileInput' )
          , dirPath = $dialog.value;
        // set the value to the Files library. if the callback
        // is triggered we'll update the shareDir
        Files.setShareDir( dirPath, function () {
            ModelView.update( 'shareDir', dirPath );
        });
    },
    // change page event
    navClick: function ( event, page ) {
        if ( page !== this.navPage ) {
            win.emit( page + '.show' );
        }
    }
}

// library
var SettingsPage = function () {
    // render the error page
    win.on( 'settings.show', function () {
        ModelView.data.shareDir = Files.shareDir;
        ModelView.data.adminEnabled = Util.flags.admin;
        ModelView.render();
    });
};

// return
module.exports = function ( _win, _Files, _Util ) {
    win = _win;
    Files = _Files;
    Util = _Util;
    return SettingsPage();
};