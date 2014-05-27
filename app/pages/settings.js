/**
 * Settings Page
 */

// dependencies
var win
  , Files;

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
    }
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
          , dirPath = $dialog.value
          , self = this;
        // set the value to the Files library. if the callback
        // is triggered we'll update the shareDir
        Files.setShareDir( dirPath, function () {
            self.shareDir( dirPath );
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
        ModelView.render();
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return SettingsPage();
};