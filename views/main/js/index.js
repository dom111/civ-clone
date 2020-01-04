'use strict';

const Engine = require('../../../app/engine.js');

window.addEventListener('load', function() {
    global.debug = (window.location.href.indexOf('debug=true') > -1);
    const engine = global.engine = new Engine();

    var preload = document.getElementById('preload');

    Engine.Plugin.filter({type: 'asset', package: 'base-renderer'}).forEach((component) => component.contents.forEach((assetPath) => preload.innerHTML += '<img src="file://' + assetPath + '" data-path="' + assetPath + '"/>'));

    document.querySelector('#main-menu').innerHTML = engine.template('main/mustache/menu.mustache');

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        if (engine.started) {
            return false;
        }

        engine.start();
    });
});
