/**
 * Utility Library
 *
 * Global helpers used throughout the application.
 */

var Util = {
    // error message
    errorMessage: "",

    // flags from command line and other places
    flags: {
        admin: false
    },

    // read in the argv flags and save them
    setFlags: function ( flags ) {
        for ( var i in flags ) {
            this.flags[ flags[ i ] ] = true;
        }
    },

    // set the error message
    setError: function ( message ) {
        this.errorMessage = message;
    },

    // get the error message
    getError: function () {
        return this.errorMessage;
    },

    // log a message
    log: function ( message, type ) {
        switch ( type ) {
            case 'debug': console.log( message ); break;
            case 'error': console.error( message ); break;
            case 'info' : console.info( message ); break;
            case 'warn' : console.warn( message ); break;
        }
    }
};

// return
module.exports = Util;