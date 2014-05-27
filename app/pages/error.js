/**
 * Error Page
 */

// dependencies
var win;

// include libraries
var ModelView = require( '../library/modelview.js' )(
    './app/views/error.html',
    {
        'nav' : './app/views/partials/nav.html'
    });

// set up the model data
ModelView.data = {
    message: ""
};

// library
var ErrorPage = function () {
    // render the error page
    win.on( 'error.show', function ( message ) {
        ModelView.data.message = message;
        ModelView.render();
    });
};

// return
module.exports = function ( _win ) {
    win = _win;
    return new ErrorPage();
};