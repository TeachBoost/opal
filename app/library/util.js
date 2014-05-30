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
    }
};

// return
module.exports = Util;