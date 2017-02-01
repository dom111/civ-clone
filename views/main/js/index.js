'use strict';

const Game = require('app/game');
const game = global.game = new Game();

window.addEventListener('load', function() {
    document.querySelector('#main-menu').innerHTML = game.template('main/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        game.new();
    });

    document.addEventListener('keydown', () => {
        game.emit('turn-end');
    });
});
