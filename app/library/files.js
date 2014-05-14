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
  , Util = require( './util.js' );

// library
var Files = {
    // constants
    ERR_CONFIG_WRITE: "The config file could not be saved.",
    CHECKING_ACCESS: "Checking directory access",

    // shared directory path
    shareDir: null,

    // array of friends
    friends: [],

    // load the configuration file. return false if we can't
    // read or write to it.
    loadConfig: function () {
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
            this.friends = ( _.has( parsed, 'friends' ) )
                ? parsed.friends
                : [];
        } catch ( e ) {
            return false;
        }
    },

    // whether or not the share directory has been set
    hasShareDir: function () {
        return this.shareDir
            && this.shareDir.length;
    },

    // sets the shared directory. this tests if the directory
    // exists and is writable. it will set the working screen
    // while it works and trigger a callback on success.
    setShareDir: function ( shareDir, callback ) {
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
            if ( ! err ) callback();
        });
    },

    // writes the config data to the config file
    writeConfig: function () {
        var configPath = gui.App.dataPath;
        // build the config object
        var config = {
            shareDir: this.shareDir,
            friends: this.friends };
        // write the file
        fs.writeFile(
            configPath + '/config',
            JSON.stringify( settings, null, 4 ),
            function ( err ) {
                if ( err ) {
                    Util.setError( self.ERR_CONFIG_WRITE );
                }
            });
    }
};

// return
module.exports = function ( _win, _gui ) {
    win = _win;
    gui = _gui;
    return Files;
}