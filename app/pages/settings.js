/**
 * Settings Page
 */

// dependencies
var win
  , Files
  , ko = require( 'knockout' );

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/settings.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    // shared folder setting
    shareDir: ko.observable( null ),
    // activate nav page
    navPage: 'settings',
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
    }
};

// library
var SettingsPage = function () {
    // render the error page
    win.on( 'settings.show', function () {
        ModelView.data.shareDir( Files.shareDir );
        ModelView.render();
        ModelView.activate();
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return SettingsPage();
};