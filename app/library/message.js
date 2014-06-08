/**
 * Messaging Library
 *
 * Handles working/status messages and application
 * notifications.
 */

// dependencies
var win,
    _ = require( 'underscore' );

// ModelView for interacting with the notifications
var NotifModel = require( '../library/modelview.js' )(
    './app/views/notifications.html' );
// model data
NotifModel.data = {
    notifications: []
};
// event handlers
NotifModel.events = {
    // close the notification
    close: function ( event, index ) {
        NotifModel.data.notifications.splice( index, 1 );
    }
};

// library
var Message = function () {
    var self = this;

    // working/loading screen
    win.on( 'message.working', function ( message ) {
        message = message || 'Loading';
        self.updateWorking( message )
    });
    win.on( 'message.working.close', function () {
        self.closeWorking();
    });

    // status updates
    win.on( 'message.status', function ( message, key ) {
        self.updateStatus( message, key )
    });
    win.on( 'message.status.remove', function ( key ) {
        self.removeStatus( key );
    });
    win.on( 'message.status.clear', function () {
        self.clearStatus();
    });

    // notifications
    win.on( 'message.notify', function ( message, type, options ) {
        self.notify( message, type, options );
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

    // clears all status messages
    this.clearStatus = function () {
        var $statusMessages = document.getElementById( 'status-messages' );
        this.statuses = {};
        $statusMessages.innerHTML = '';
        $statusMessages.style.display = 'none';
        return true;
    };

    // render a notification to the screen
    this.notify = function ( message, type, options ) {
        // create a new message component and insert it into
        // the top of the notifications element.
        var bgColor;
        switch ( type ) {
            case 'success': bgColor = 'bg-green'; break;
            case 'error': bgColor = 'bg-red'; break;
            case 'warning': bgColor = 'bg-orange'; break;
            case 'info': bgColor = 'bg-blue'; break;
        }
        // add the notif
        NotifModel.data.notifications.push({
            message: message,
            color: bgColor
        });
        // set a timeout to remove any notifications that
        // are expired.
        
    };
};

// return
module.exports = function ( _win ) {
    win = _win;
    // render the ractive view
    NotifModel.render(
        function () {},
        document.getElementById( 'notifications' ));
    return Message();
}