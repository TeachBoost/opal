/**
 * Send a File Page
 */

// dependencies
var win
  , Files;

// get the model-view
var ModelView = require( '../library/modelview.js' )(
    './app/views/send.html',
    {
        'nav' : './app/views/partials/nav_send.html'
    });

// set up the model data
ModelView.data = {

};

// set up the model events
ModelView.events = {
    // change page event
    navClick: function ( event, page ) {
        if ( page !== this.navPage ) {
            win.emit( page + '.show' );
        }
    },
    // submit the form
    submit: function () {
        console.log( 'submitted form' );
    }
}

// library
var SendPage = function () {
    // render the error page
    win.on( 'send.show', function () {
        ModelView.render();
    });
};

// return
module.exports = function ( _win, _Files ) {
    win = _win;
    Files = _Files;
    return SendPage();
};