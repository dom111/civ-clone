'use strict';

const Game = require('./game');
const mustache = require('mustache');

module.exports = (function() {
    return {
        template: function(template) {
            return mustache.render(Game.util.template(template), {
                translations: Game.translations
            });
        }
    }
})();
