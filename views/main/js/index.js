'use strict';

const Engine = require('app/engine');

window.addEventListener('load', function() {
    global.debug = (window.location.href.indexOf('debug=true') > -1);
    const engine = global.engine = new Engine();

    document.querySelector('#main-menu').innerHTML = engine.template('main/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        if (engine.started) {
            return false;
        }

        engine.start();
    });
});
