/**
 * Messaging Library
 *
 * Handles working/status messages and application
 * notifications.
 */

// dependencies
var win;

// library
var Message = function () {
    var self = this;
    // window events
    win.on( 'message.working', function ( message ) {
        self.updateWorking( message )
    });

    win.on( 'message.working.close', function () {
        self.closeWorking();
    });

    // show the working/status message
    this.updateWorking = function ( message ) {

    };

    // close the working/status message
    this.closeWorking = function () {

    };
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Message;
}