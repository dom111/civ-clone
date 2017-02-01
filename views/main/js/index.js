'use strict';

const Game = require('app/game');
const game = global.game = new Game();

window.addEventListener('load', function() {
    game.loadPlugins();

    document.querySelector('#main-menu').innerHTML = game.template('main/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        if (game.started) {
            return false;
        }

        // TODO: options
        game.start();
    });
});
