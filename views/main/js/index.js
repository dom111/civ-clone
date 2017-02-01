'use strict';

const Engine = require('app/engine');

window.addEventListener('load', function() {
    const engine = global.engine = new Engine();

    document.querySelector('#main-menu').innerHTML = engine.template('main/mustache/menu.mustache', {
        // TODO: styles should probably be in the main .html file, or loaded differently...
        styles: Engine.Plugin.get('style')
    });

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        if (engine.started) {
            return false;
        }

        engine.start();
    });
});
