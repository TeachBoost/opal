/**
 * Utility Library
 *
 * Global helpers used throughout the application.
 */

var Util = {
    // error message
    errorMessage: "",

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