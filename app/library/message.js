/**
 * Messaging Library
 *
 * Handles working/status messages and application
 * notifications.
 */

// dependencies
var win,
    _ = require( 'underscore' );

// library
var Message = function () {
    var self = this;
    // window events
    win.on( 'message.working', function ( message ) {
        message = message || 'Loading';
        self.updateWorking( message )
    });

    win.on( 'message.working.close', function () {
        self.closeWorking();
    });

    win.on( 'message.status', function ( message, key ) {
        self.updateStatus( message, key )
    });
    win.on( 'message.status.remove', function ( key ) {
        self.removeStatus( key );
    });
    win.on( 'message.status.clear', function () {
        self.clearStatus();
    });

    // show the working/status message
    this.updateWorking = function ( message ) {
        return this.updateStatus( message, 'loading' );
    };

    // close the working/status message
    this.closeWorking = function () {
        return this.removeStatus( 'loading' );
    };

    // stack of status messages. new ones get added
    // to the stack; removing an item by key should then
    // show the next most recent item.
    statuses = {};

    // update the loading message on the screen
    this.updateStatus = function ( message, key ) {
        // push message to the stack
        this.statuses[ key ] = message;
        // append HTML to the loading screen
        var $statusMessages = document.getElementById( 'status-messages' );
        $statusMessages.innerHTML = message + '&hellip;';
        $statusMessages.style.display = 'block';
        return true;
    };

    // removes the status message by key
    this.removeStatus = function ( key ) {
        // remove by key
        if ( _.has( this.statuses, key ) ) {
            delete this.statuses[ key ];
        }
        var keys = _.keys( this.statuses );
        // if the stack is empty, hide the container
        if ( ! keys.length ) {
            return this.clearStatus();
        }
        // get another key from the statuses to display
        var nextMessage = this.statuses[ keys[ 0 ] ]
          , $statusMessages = document.getElementById( 'status-messages' );
        // update the message
        $statusMessages.innerHTML = nextMessage + '&hellip;';
        $statusMessages.style.display = 'block';
        return true;
    };

    this.clearStatus = function () {
        var $statusMessages = document.getElementById( 'status-messages' );
        this.statuses = {};
        $statusMessages.innerHTML = '';
        $statusMessages.style.display = 'none';
        return true;
    };
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Message();
}