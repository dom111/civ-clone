'use strict';

const Game = require('./game');

module.exports = (function() {
    return {
        main: function() {
            return Game.util.createWindow({
                title: `CivOne - ${Game.translation('main_menu')}`,
                path: 'main-menu/html/index.html'
            });
        }
    }
})();
