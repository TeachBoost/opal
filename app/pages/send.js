/**
 * Send a File Page
 */

// dependencies
var win
  , Files;

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/send.html',
    {
        'nav' : './app/views/partials/nav_send.html'
    });

// set up the model data
ModelView.data = {
    attachedFile: '',
    friends: []
};

// set up the model events
ModelView.events = {
    // change page event
    navClick: function ( event, page ) {
        if ( page !== this.navPage ) {
            win.emit( page + '.show' );
        }
    },
    // cancel button click
    cancel: function () {
        ModelView.update( 'attachedFile', '' );
        win.emit( 'files.show' );
    },
    // open the file dialog
    openDialog: function () {
        var $dialog = document.getElementById( 'attachedFileInput' );
        $dialog.click();
    },
    // when the file dialog is changed
    changeFile: function () {
        var $dialog = document.getElementById( 'attachedFileInput' )
          , filePath = $dialog.value;
          ModelView.update( 'attachedFile', filePath );
    },
    // submit the form
    submit: function () {
        console.log( 'submitted form' );
    }
}

// library
var SendPage = function () {
    // render the error page
    win.on( 'send.show', function () {
        ModelView.data.friends = Files.friends;
        ModelView.render();
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return SendPage();
};