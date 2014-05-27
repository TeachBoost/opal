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

    win.on( 'message.status', function ( message ) {
        self.updateStatus( message )
    });

    win.on( 'message.status.clear', function () {
        self.clearStatus();
    });

    // show the working/status message
    this.updateWorking = function ( message ) {

    };

    // close the working/status message
    this.closeWorking = function () {

    };

    // update the loading message on the screen
    this.updateStatus = function ( message ) {
        // append HTML to the loading screen
        var $loading = document.getElementById( 'status-messages' );
        $loading.innerHTML = message + '&hellip;';
        $loading.style.display = 'block';
    };

    this.clearStatus = function () {
        var $loading = document.getElementById( 'status-messages' );
        $loading.innerHTML = '';
        $loading.style.display = 'none';
    }
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Message();
}