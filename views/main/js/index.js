'use strict';

const Engine = require('app/engine');

window.addEventListener('load', function() {

    document.querySelector('#main-menu').innerHTML = game.template('main/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();
        const game = global.game = new Engine();

        if (game.started) {
            return false;
        }

        game.start();
    });
});
