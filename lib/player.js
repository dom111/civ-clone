'use strict';

const Game = require('./game');

module.exports = (function() {
    return class {
        constructor(details) {
            details = details || {};

            this.cities = [];

            Game.emit('player-added', this);
        }
    }
})();

