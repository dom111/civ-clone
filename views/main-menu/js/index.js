const remote = require('remote');
const Game = remote.getGlobal('Game');
const View = remote.getGlobal('View');

window.addEventListener('load', function() {
    document.querySelector('#main-menu').innerHTML = View.template('main-menu/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        Game.new();
    });

    document.addEventListener('keydown', () => {
        Game.emit('turn-end');
    });
});
