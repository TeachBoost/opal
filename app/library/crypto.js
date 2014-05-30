/**
 * Encryption / Decryption Library
 *
 * Uses keybase CLI tools to do all crypto in the app.
 */

// dependencies
var exec = require( 'exec' )
  , win
  , _ = require( 'underscore' )
  , Util = require( './util.js' );

// library
var Crypto = {
    // error messages
    ERR_NOT_ENABLED: "Keybase isn't installed on your system.",
    ERR_NO_FRIENDS: "You aren't tracking anyone on Keybase!",
    ERR_NO_USER: "You aren't logged in to Keybase!",

    // loading messages
    LOAD_ENABLED: "Checking if Keybase is installed",
    LOAD_FRIENDS: "Loading your Keybase friends",

    // keybase status
    status: null,
    // keybase user
    user: null,
    // tracked users (friends)
    friends: [],

    /**
     * Is keybase enabled? is there a user session?
     * @param flag If true, run task in background
     */ 
    enabled: function ( flag ) {
        var self = this;
        // set the status message
        win.emit( 'message.status', this.LOAD_ENABLED, 'crypto_enabled' );
        // if the flag came in, bypass the loading
        flag && win.emit( 'app.load', 'crypto.enabled', true );
        // run `keybase version` to see if the program is there
        exec( 'keybase status', function ( err, out, code ) {
            // hide status message
            win.emit( 'message.status.remove', 'crypto_enabled' );
            // error handle. out should have json data about the user
            if ( ! out.length ) {
                // sometimes err can contain gpg warnings, just
                // ignore it for now
                win.emit( 'error.show', self.ERR_NOT_ENABLED );
                ! flag && win.emit( 'app.load', 'crypto.enabled', false );
            }
            else {
                // parse the response
                var parsed = JSON.parse( out );
                if ( ! _.has( parsed, 'user' )
                    || ! _.has( parsed.user, 'name' )
                    || ! parsed.user.name.length )
                {
                    win.emit( 'error.show', self.ERR_NO_USER );
                    ! flag && win.emit( 'app.load', 'crypto.enabled', false );
                }
                // save this info
                self.user = parsed.user;
                self.status = parsed.status;
                // emit the window event for anything listening to
                // get this info
                win.emit( 'crypto.user', self.user );
                // we're good to go
                ! flag && win.emit( 'app.load', 'crypto.enabled', true );
            }
        });
    },

    /**
     * Are they tracking anyone?
     * @param flag If true, run task in background
     */
    friends: function ( flag ) {
        var self = this;
        // set the status message
        win.emit( 'message.status', this.LOAD_FRIENDS, 'crypto_friends' );
        // if the flag came in, bypass the loading
        flag && win.emit( 'app.load', 'crypto.friends', true );
        // run `keybase list-tracking` to see if the user is
        // tracking anyone. save the tracked users in friends[]
        exec( 'keybase list-tracking', function ( err, out, code ) {
            // remove status message
            win.emit( 'message.status.remove', 'crypto_friends' );
            // error handle the output
            if ( err || ! out.length ) {
                win.emit( 'error.show', self.ERR_NO_FRIENDS );
                ! flag && win.emit( 'app.load', 'crypto.friends', false );
            }
            else {
                // save the users to the friends array
                self.friends = _.compact( out.split( "\n" ) );
                // emit the window event for anything listening to
                // get this info
                win.emit( 'crypto.friends', self.friends );
                // we're done
                ! flag && win.emit( 'app.load', 'crypto.friends', true );
            }
        });
    }
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Crypto;
};