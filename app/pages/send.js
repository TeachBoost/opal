/**
 * Send a File Page
 */

// dependencies
var win
  , Files;

// constants
var MSG_FILE_SENT = "Your file has been encrypted and sent!";

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
        ModelView.ractive.fire( 'clearForm' );
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
        var self = this;
        // verify that a recipient and a file was selected
        var $dialog = document.getElementById( 'attachedFileInput' )
          , filePath = $dialog.value
          , $select = document.getElementById( 'friendInput' )
          , friend = 'mikegioia'; //$select.value;
        // encrypt and send the file via the Files library
        Files.send( filePath, friend );
    },
    // clear the webform
    clearForm: function () {
        var $dialog = document.getElementById( 'attachedFileInput' )
          , $select = document.getElementById( 'friendInput' );
        $dialog.value = '';
        $select.value = '';
        ModelView.update( 'attachedFile', '' );
    }
};

// library
var SendPage = function () {
    // render the error page
    win.on( 'send.show', function () {
        ModelView.data.friends = Files.friends;
        ModelView.render();
    });
    // clear the form
    win.on( 'send.success', function () {
        ModelView.ractive.fire( 'clearForm' );
        win.emit( 'message.notify', MSG_FILE_SENT, 'success' );
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return SendPage();
};