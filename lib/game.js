'use strict';

const EventEmitter = require('events');
const electron = require('electron');
const extend = require('extend');

const app = electron.app;

module.exports = (function() {
    class Game extends EventEmitter {
        // key properties
        get basePath() {
            return __dirname + '/../';
        }

        get app() {
            return app;
        }

        // core functions
        init() {
            this.menu.main();
        }

        // main modules
        get menu() {
            return require('./menu');
        }

        get util() {
            return require('./util');
        }

        get world() {
            return require('./world');
        }

        get plugin() {
            return require('./plugin');
        }

        get window() {
            return electron.BrowserWindow;
        }

        get city() {
            return require('./city');
        }

        player(options) {
            var Player = require('./player');
            return new Player(options);
        }

        // helper methods
        translation(key) {
            return require('./translation').get(key);
        }

        get translations() {
            return require('./translation').getAll();
        }

        setting(key, value) {
            return require('./settings').get(key, value);
        }

        new(options) {
            var game = this;

            game.defaultOptions = {
                // TODO
                players: 1,
                difficulty: 1
            };

            game.plugin.get('game-modifier').forEach((plugin) => {
                (plugin.contents || []).forEach((component) => {
                    // TODO
                    //
                    // const fs = require('fs');
                    // const sbfs = require("sandboxed-fs").createWhitelisted([...]);
                    // const vm = require("vm");
                    // const map = {
                    //     'Game': this,
                    //     'fs': sbfs
                    // };
                    // const whitelist = [];
                    //
                    // vm.runInNewContext(fs.readFileSync(this.basePath + component), {
                    //     Game: this,
                    //     require: (module) => module in map ? map[module] : (whitelist.includes(module) ? require(module) : null)
                    // });
                    require(game.basePath + component);
                    const vm = require('vm');
                    const fs = require('fs');
                    var code = fs.readFileSync(game.basePath + component);
                    console.log(code);
                    vm.runInNewContext(code, extend({
                        // allows plugins to use these as if they already exist
                        City: game.city,
                        Game: game
                        // TODO: all classes
                    }, global));
                });
            });

            game.options = extend(game.defaultOptions, options);
            game.players = [];

            for (var i = 0; i < game.options.players; i++) {
                game.players.push(game.player({
                    // TODO
                    title: 'King',
                    leader: 'Dom',
                    name: 'English',
                    name2: 'England',
                    cities: []
                }));
            }

            game.on('turn-end', (e) => {
                game.players.forEach((player) => {
                    player.cities.forEach((city) => {
                        city.emit('turn-end');
                    });
                });

                console.log('Turn end complete.');
            });
        }
    }

    return new Game;
})();
