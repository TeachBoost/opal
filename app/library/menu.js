/**
 * Menu Library
 *
 * Attaches menubar and content menus
 */

// dependencies
var win
  , gui;

// library
var Menu = {
    // return a new menubar object for the app
    menubar: function () {
        // create the menubar
        var menubar = new gui.Menu({
            type: 'menubar'
        });
        // create menu items
        var file = new gui.MenuItem({
            label: 'File'
        });
        // add submenu
        var submenu = new gui.Menu();
        var quit = new gui.MenuItem({
            label: 'Quit',
            click: function () {
                win.close();
            }
        });
        submenu.append( quit );
        file.submenu = submenu;
        menubar.append( file );

        // return the unattached menubar
        return menubar;
    }
};

// return
module.exports = function ( _win, _gui ) {
    win = _win;
    gui = _gui;
    return Menu;
};