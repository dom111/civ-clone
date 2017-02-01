const Game = require('./game');
const extend = require('extend');
var translations = {};

module.exports = (function() {
    var _load = function(language) {
        Game.plugin.get('translation').filter(function(translation) {
            return translation.language == Game.setting('language')
        }).forEach(function(translation) {
            translation.contents.forEach(function(file) {
                extend(translations, Game.util.loadJSON(file));
            });
        });
    };

    _load();

    return {
        get: function(key) {
            return key in translations ? translations[key] : `Missing key: ${key}`;
        },
        getAll: function() {
            return translations;
        }
    }
})();
