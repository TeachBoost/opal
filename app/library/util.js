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
    },

    // update the loading message on the screen
    updateLoading: function ( message ) {
        // append HTML to the loading screen
        var $loading = document.getElementById( 'loading-messages' );
        $loading.innerHTML = message + '&hellip;';
    }
};

// return
module.exports = Util;