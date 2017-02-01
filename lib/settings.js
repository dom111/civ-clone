'use strict';

const Game = require('./game');
const fs = require('fs');
const extend = require('extend');

const settingsFile = 'settings.json';
var settings = {};

module.exports = (function() {
    const _load = function() {
        return Game.util.loadJSON(settingsFile);
    },
    _save = function() {
        return Game.util.saveJSON(settingsFile, settings);
    };

    extend(settings, _load());

    return {
        // main init
        get: function(key, value) {
            return settings[key] || value;
        },
        set: function(key, value) {
            settings[key] = value;
            _save();

            return true;
        }
    }
})();
