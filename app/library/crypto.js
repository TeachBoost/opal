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
    // loading messages
    LOAD_ENABLED: "Checking if Keybase is installed",
    LOAD_FRIENDS: "Loading your Keybase friends",

    // tracked users (friends)
    friends: [],

    // is keybase enabled?
    enabled: function () {
        var self = this;
        // run `keybase version` to see if the program is there
        win.emit( 'message.status', this.LOAD_ENABLED );
        exec( 'keybase version', function ( err, out, code ) {
            if ( ! out.length ) {
                // sometimes err can contain gpg warnings, just
                // ignore it for now
                Util.setError( self.ERR_NOT_ENABLED );
                win.emit( 'app.load', 'crypto.enabled', false );
            }
            else {
                win.emit( 'app.load', 'crypto.enabled', true );
            }
        });
    },

    // are they tracking anyone?
    friends: function () {
        var self = this;
        // run `keybase list-tracking` to see if the user is
        // tracking anyone. save the tracked users in friends[]
        win.emit( 'message.status', this.LOAD_FRIENDS );
        // @TEMPORARY
        win.emit( 'app.load', 'crypto.friends', true );
        return;
        exec( 'keybase list-tracking', function ( err, out, code ) {
            if ( err || ! out.length ) {
                Util.setError( self.ERR_NO_FRIENDS );
                win.emit( 'app.load', 'crypto.friends', false );
            }
            else {
                // save the users to the friends array
                self.friends = _.compact( out.split( "\n" ) );
                console.log( self.friends );
                win.emit( 'app.load', 'crypto.friends', true );
            }
        });
    }
};

// return
module.exports = function ( _win ) {
    win = _win;
    return Crypto;
};