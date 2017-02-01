'use strict';

const Game = require('./game');
const fs = require('fs');
const extend = require('extend');

const pluginPath = 'plugins/';
const enabledPluginPath = `${pluginPath}enabled/`;
// const basePlugin = {
//     options: [
//         // TODO: define all possible options here for reference
//     ]
// };
var plugins = {};

module.exports = (function() {
    return {
        path: enabledPluginPath,
        load: function() {
            fs.readdirSync(enabledPluginPath).filter(function(name) {
                // skip hidden files
                // TODO: check if file has hidden attribute?
                return !(name.match(/^\./))
            }).map(function(plugin) {
                // load each enabled plugin's definition
                return extend({}, Game.util.loadJSON(`${enabledPluginPath + plugin}/plugin.json`), {
                    // keep the path for use when loading the components
                    __path: `${enabledPluginPath + plugin}/`
                });
            }).sort(function(a, b) {
                // order by the weighting to allow incremental updates
                return (a.weight > b.weight) ?
                    1 : (a.weight === b.weight) ?
                    0 : -1;
            }).forEach(function(pluginData) {
                (pluginData.components || []).sort(function(a, b) {
                    return (a.weight > b.weight) ?
                        1 : (a.weight === b.weight) ?
                        0 : -1;
                }).forEach(function(component) {
                    // expand content files into full paths for reading
                    component.contents = (component.contents || []).map(function(file) {
                        return file.match(/^\//) ? file : (pluginData.__path + file);
                    });

                    if (!(component.type in plugins)) {
                        plugins[component.type] = [];
                    }

                    plugins[component.type].push(component);
                });
            });

        },
        get: function(pluginType) {
            if (typeof pluginType !== 'undefined') {
                return (plugins[pluginType] || []);
            }
            else {
                return plugins;
            }
        }
    }
})();
