'use strict';

const EventEmitter = require('events');

module.exports = (function() {
    return class extends EventEmitter {
        constructor(details) {
            var city = this;

            city.player = details.game.players[0]; // TODO

            details = details || {};

            if (!('x' in details) || !('y' in details)) {
                throw 'Missing properties for City constructor.';
            }

            Game.emit('city-created', cty);
        }

        showCityScreen() {
            console.log('showCityScreen');
        }
    }
})();

