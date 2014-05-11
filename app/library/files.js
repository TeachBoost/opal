/**
 * File Input / Output Library
 *
 * Handles reading and writing of all files used by the
 * application.
 */

// dependencies
var app
  , fs = require( 'fs' )
  , _ = require( 'underscore' )
  , Util = require( './util.js' );

// library
var Files = {
    // constants
    ERR_CONFIG_WRITE: "The config file could not be saved.",

    // shared directory path
    shareDir: null,

    // array of friends
    friends: [],

    // load the configuration file. return false if we can't
    // read or write to it.
    loadConfig: function () {
        var configPath = app.dataPath;
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

    // writes the config data to the config file
    writeConfig: function () {
        var configPath = app.dataPath;
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
module.exports = function ( _app ) {
    app = _app;
    return Files;
}