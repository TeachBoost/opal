/**
 * Messaging Library
 *
 * Handles working/status messages and application
 * notifications.
 */

// dependencies
var win;

// window events
win.on( 'message.working', function ( message ) {
    Message.updateWorking( message )
});

win.on( 'message.working.close', function () {
    Message.closeWorking();
});

// library
var Message = {
    // show the working/status message
    updateWorking: function ( message ) {

    },

    // close the working/status message
    closeWorking: function () {

    }
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Message;
}