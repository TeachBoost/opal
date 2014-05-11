/**
 * Base Model-View
 *
 * Handles loading view files, maintaining data state,
 * and rendering.
 */

// dependencies
// file system interaction
var fs = require( 'fs' )
  , ko = require( 'knockout' )
  , Mustache = require( 'mustache' );

// define the base model
var ModelView = function () {
    // raw view file contents; lazy-loaded
    this.view = null;
    // the View-Model object passed to knockout
    this.data = {};
    // partial view file contents
    this.partials = {};

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

    // activates the knockout view-model
    this.activate = function () {
        ko.applyBindings( this.data );
    };

    // renders the views and partials to the DOM
    this.render = function ( body ) {
        var template = Mustache.render(
            this.view,
            {},
            this.partials );
        document.getElementById( 'root' ).innerHTML = template;
    };
};

// return
module.exports = function ( view, partials ) {
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