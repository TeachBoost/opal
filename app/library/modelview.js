/**
 * Base Model-View
 *
 * Handles loading view files, maintaining data state,
 * and rendering.
 */

// var dependencies
var fs = require( 'fs' )
  , Ractive = require( 'ractive' )
  , _ = require( 'underscore' );
// global dependencies
require( './transitions/fade' );

// define the base model
var ModelView = function () {
    // raw view file contents; lazy-loaded
    this.view = null;
    // partial view file contents
    this.partials = {};
    // the View-Model object passed to knockout
    this.data = {};
    // events to bind
    this.events = {};
    // ractive pointer
    this.ractive = null;

    // load a view file off the filesystem
    this.loadView = function ( path ) {
        var self = this;
        // read the file off the system and save its contents
        self.view = fs.readFileSync(
            path, {
                encoding: 'utf8'
            });
    };

    // load a partial and save it as a key on the partials
    // object
    this.loadPartial = function ( name, path ) {
        var self = this;
        // read the file off the system and save its contents
        self.partials[ name ] = fs.readFileSync(
            path, {
                encoding: 'utf8'
            });
    };

    // load an array of partials
    this.loadPartials = function ( partials ) {
        for ( i in partials ) {
            this.loadPartial( i, partials[ i ] );
        }
    };

    // renders the views and partials to the DOM
    this.render = function ( callback /*, $el */ ) {
        // get the root element
        var $el = ( arguments.length > 1 )
            ? arguments[ 1 ]
            : document.getElementById( 'root' );
        // if the ractive object exists, tear it down first
        if ( ! _.isNull( this.ractive ) ) {
            this.ractive.teardown();
        }
        // render the ractive view
        this.ractive = new Ractive({
            el: $el,
            template: this.view,
            partials: this.partials,
            data: this.data
        });
        // attach the events
        for ( var i in this.events ) {
            this.ractive.on( i, this.events[ i ] );
        }
        // if a callback came in, trigger it
        if ( _.isFunction( callback ) ) {
            callback();
        }
    };

    // update a data attribute and then trigger the
    // ractive update.
    this.update = function ( key, value ) {
        this.data[ key ] = value;
        this.ractive.update( key );
    };
};

// return
module.exports = function ( view, partials, _win ) {
    var view = ( arguments.length )
        ? arguments[ 0 ]
        : null
      , partials = ( arguments.length > 1 )
        ? arguments[ 1 ]
        : {}
      , MV = new ModelView();

    // set these if they came in the constructor
    if ( view ) {
        MV.loadView( view );
    }

    if ( partials ) {
        MV.loadPartials( partials );
    }

    return MV;
};