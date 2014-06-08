/**
 * File Input / Output Library
 *
 * Handles reading and writing of all files used by the
 * application.
 */

// dependencies
var win
  , gui
  , fs = require( 'fs' )
  , _ = require( 'underscore' )
  , Util = require( 'util' )
  , Crypto = require( 'crypto' );

// library
var Files = function () {
    var self = this;

    // constants
    this.ERR_CONFIG_WRITE = "The config file could not be saved.";
    this.CHECKING_ACCESS ="Checking directory access";
    this.ERR_BAD_SEND_INPUT = "Please choose a friend from the list and select a file before sending.";
    this.ERR_BAD_FRIEND = "You're not tracking that person! Pick a valid recipient.";
    this.ERR_NO_FILE = "The file you selected could not be read from your computer.";

    // keybase user id
    this.userId = null;
    // keybase user info
    this.userObj = null;
    // shared directory path
    this.shareDir = null;
    // array of friends
    this.friends = [];
    // array of sent files, loaded from shared directory
    this.sentFiles = [];
    // array of received files, loaded from shared directory
    this.receivedFiles = [];

    /**
     * Load the configuration file. return false if we can't
     * read or write to it.
     */
    this.loadConfig = function () {
        var configPath = gui.App.dataPath;
        // check if the file exists
        if ( ! fs.existsSync( configPath + '/config' ) ) {
            return false;
        }
        // open the config file and JSON parse it
        var contents = fs.readFileSync(
            configPath + '/config',
            {
                encoding: 'utf8'
            });
        // if there's nothing, return false
        if ( ! contents.length ) {
            return false;
        }
        // parse the contents and save the settings locally
        try {
            var parsed = JSON.parse( contents );
            this.shareDir = ( _.has( parsed, 'shareDir' ) )
                ? parsed.shareDir
                : null;
            this.userId = ( _.has( parsed, 'userId' ) )
                ? parsed.userId
                : null;
            this.userObj = ( _.has( parsed, 'userObj' ) )
                ? parsed.userObj
                : null;
            this.friends = ( _.has( parsed, 'friends' ) )
                ? parsed.friends
                : [];
        } catch ( e ) {
            return false;
        }
    };

    /**
     * Whether or not the share directory has been set
     */
    this.hasShareDir = function () {
        return this.shareDir
            && this.shareDir.length;
    };

    /**
     * Sets the shared directory. this tests if the directory
     * exists and is writable. it will set the working screen
     * while it works and trigger a callback on success.
     */
    this.setShareDir = function ( shareDir, callback ) {
        // set the app to working-mode
        win.emit( 'message.working', this.CHECKING_ACCESS )

        // check if directory exists
        if ( ! fs.existsSync( shareDir ) ) {
            win.emit( 'message.working.close' );
            return false;
        }

        // check if directory is writable
        fs.readdir( shareDir, function ( err, files ) {
            win.emit( 'message.working.close' );
            // trigger callback on success
            if ( ! err ) {
                self.shareDir = shareDir;
                self.writeConfig();
                callback();
            }
        });
    };

    /**
     * Writes the config data to the config file
     */
    this.writeConfig = function () {
        var configPath = gui.App.dataPath;
        // build the config object
        var config = {
            shareDir: this.shareDir,
            userId: this.userId,
            userObj: this.userObj,
            friends: this.friends };
        // write the file
        fs.writeFile(
            configPath + '/config',
            JSON.stringify( config, null, 4 ),
            function ( err ) {
                if ( err ) {
                    Util.setError( self.ERR_CONFIG_WRITE );
                }
            });
    };

    /**
     * Load the received files into the local "files" array
     * this will re-scan the user's shared directory looking
     * for any files that were sent to the user.
     */
    this.getReceivedFiles = function () {

        /*
        fs.readdir( '/path/to/html/files', function(err, files) {
            files.filter(function(file) { return file.substr(-5) == '.html'); })
                .forEach(function(file) { fs.readFile(file, 'utf-8', function(err, contents) { inspectFile(contents); }); });
        });
        */
        return [];
    };

    /**
     * Encrypt a file for the specified friend. this should use
     * the crypto library to save the file in the shared directory
     * and then add an encrypted "info" file.
     */
    this.send = function ( filePath, friend, callback ) {
        // check if we got values in
        if ( ! filePath.length || ! friend.length ) {
            win.emit( 'message.notify', this.ERR_BAD_SEND_INPUT, 'info' );
            return false;
        }
        // check if the friend exists
        if ( _.indexOf( this.friends, friend ) == -1 ) {
            win.emit( 'message.notify', this.ERR_BAD_FRIEND, 'info' );
            return false;
        }
        // check if the file exists
        if ( ! fs.existsSync( filePath ) ) {
            win.emit( 'message.notify', this.ERR_NO_FILE, 'info' );
            return false;
        }
        // encrypt the file using the Crypto library. this will
        // be done asynchronously so we can call our callback on
        // success.
        if ( Crypto.encrypt( filePath, friend ) ) {
            callback();
        }
    };

    /**
     * Read the user object from the crypto library
     */
    win.on( 'crypto.user', function ( user ) {
        self.userId = user.name;
        self.userObj = user;
        self.writeConfig();
    });

    /**
     * Read the friends array from the crypto library
     */
    win.on( 'crypto.friends', function ( friends ) {
        self.friends = friends;
        self.writeConfig();
    });
};

// return
module.exports = function ( _win, _gui ) {
    win = _win;
    gui = _gui;
    return new Files();
}