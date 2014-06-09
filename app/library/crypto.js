/**
 * Encryption / Decryption Library
 *
 * Uses keybase CLI tools to do all crypto in the app.
 */

// dependencies
var exec = require( 'exec' )
//, execSync = require( 'child_process' ).execSync
  , path = require( 'path' )
  , uuid = require( 'node-uuid' )
  , win
  , fs = require( 'fs' )
  , _ = require( 'underscore' )
  , Util = require( './util' );

// library
var Crypto = function () {
    var self = this;

    // error messages
    this.ERR_NOT_ENABLED = "Keybase isn't installed on your system.";
    this.ERR_NO_FRIENDS = "You aren't tracking anyone on Keybase!";
    this.ERR_NO_USER = "You aren't logged in to Keybase!";
    this.ERR_BAD_MKDIR = "There was a problem creating your friend's shared folder.";
    this.ERR_BAD_ENCRYPT = "There was a problem encrypting your file.";

    // loading messages
    this.LOAD_ENABLED = "Checking if Keybase is installed";
    this.LOAD_FRIENDS = "Loading your Keybase friends";
    this.LOAD_ENCRYPTING = "Encrypting file, hang on";

    // keybase status
    this.status = null;
    // keybase user
    this.user = null;
    // tracked users (friends)
    this.friends = [];

    /**
     * Is keybase enabled? is there a user session?
     * @param flag If true, run task in background
     */ 
    this.enabled = function ( flag ) {
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
    };

    /**
     * Are they tracking anyone?
     * @param flag If true, run task in background
     */
    this.friends = function ( flag ) {
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
    };

    /**
     * Encrypts the file using the friend's public key. We
     * save two encrypted files on this call:
     *   1) a .info file containing the meta info
     *   2) a .asc file containing the encrypted file
     */
    this.encrypt = function ( filePath, friend, destFolder ) {
        // set up the destination files
        // generate a new random uuid for the filename
        var destPath = destFolder + "/" + friend
          , id = uuid.v4()
          , destFile = destPath + '/' + id + '.asc'
          , destMeta = destPath + '/' + id + '.info'
        // stat the file and get the meta info about it. store this in
        // a json string which will be encrypted later.
          , fileName = path.basename( filePath )
          , fileStats = fs.statSync( filePath )
          , now = new Date()
          , meta = {
                name: fileName,
                size: fileStats[ 'size' ],
                time: now.getTime() }
          , metaJson = JSON.stringify( meta, null, 4 );

        // make the friends directory if it doesn't exist
        if ( ! fs.existsSync( destPath ) ) {
            try {
                fs.mkdirSync( destPath );
            } catch ( e ) {
                win.emit( 'message.notify', this.ERR_BAD_MKDIR, 'error' );
                return false;
            }
        }

        // since there's no execSync support yet, we need to define
        // the functions first and order everything via callbacks.
        // keybase encrypt -o DESTINATION friend filePath
        var _cmdEncryptFile = 'keybase encrypt -o ' + destFile + ' ' + friend + ' ' + filePath
          , _encryptFile = function () {
                // attach an overlay to lock the user from doing anything
                win.emit( 'message.overlay' );
                // set our status message
                win.emit( 'message.status', self.LOAD_ENCRYPTING, 'crypto_send' );
                // exec the keybase command
                exec( _cmdEncryptFile, function ( err, out, code ) {
                    // remove status message and error handle
                    win.emit( 'message.status.remove', 'crypto_send' );
                    if ( err || err.length ) {
                        Util.log( "Error encrypting file: " + err, 'error' );
                        // kill overlay and show error
                        win.emit( 'message.overlay.remove' );
                        win.emit( 'message.notify', self.ERR_BAD_ENCRYPT, 'error' );
                    } else {
                        _encryptMeta();
                    }
                });
            }
            // keybase encrypt -m JSON -o DESTINATION friend
          , _cmdEncryptMeta = "keybase encrypt -m '" + metaJson + "' -o " + destMeta + " " + friend
          , _encryptMeta = function () {
                // set the status message
                win.emit( 'message.status', self.LOAD_ENCRYPTING, 'crypto_send_meta' );
                // exec the keybase command
                exec( _cmdEncryptMeta, function ( err, out, code ) {
                    // remove status message and error handle
                    win.emit( 'message.status.remove', 'crypto_send_meta' );
                    win.emit( 'message.overlay.remove' );
                    if ( err || err.length ) {
                        Util.log( "Error encrypting meta: " + err, 'error' );
                        win.emit( 'message.notify', self.ERR_BAD_ENCRYPT, 'error' );
                    } else {
                        // set the success message and 
                        win.emit( 'send.success' );
                    }
                });
            };
        // encrypt the file first, then if that succeeded encrypt
        // the meta info.
        _encryptFile();
    };
};

// return
module.exports = function ( _win ) {
    win = _win;
    return new Crypto();
};