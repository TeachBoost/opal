/**
 * File Input / Output Library
 *
 * Handles reading and writing of all files used by the
 * application.
 */

var Files = {
    // constants

    // is keybase enabled?
    isEnabled: function () {
        return false;
    },

    // load the configuration file. return false if we can't
    // read or write to it.
    loadConfig: function () {
        return false;
    }
};

// return
module.exports = Files;