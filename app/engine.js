'use strict';

// external objects
const EventEmitter = require('events');
const util = require('util');
const electron = require('electron');
const ipc = electron.ipcRenderer;
const extend = require('extend');
const mustache = require('mustache');
const fs = require('fs');
const vm = require('vm');

module.exports = (() => {
    // private variables
    let _paths = {},
    _settings = {},
    _plugins = [],
    _pluginPaths = {},
    _pluginTypes = {},
    _loadedPlugins = [];

    // private methods
    const _path = (name, path) => {
        if (path) {
            _paths[name] = path;
        }

        return (name in _paths) ? _paths[name] : ipc.sendSync('app.getPath', name);
    },
    _loadJSON = (file) => {
        file = (file.substr(0, 1) === '/') ? file : _path('base') + file;

        try {
            fs.accessSync(file);
            return JSON.parse(fs.readFileSync(file));
        }
        catch (e) {
            console.error(`Error loading '${file}': ${e}`);
        }
    };

    const Engine = class Engine {
        constructor() {
            EventEmitter.call(this);

            this.availableTradeRates = [];
            this.templateVars = {};

            // set up useful paths
            _path('base', `${__dirname}/../`);
            _path('views', _path('base') + 'views/');
            _path('plugins', _path('base') + 'plugins/');
            _path('enabledPlugins', _path('plugins') + 'enabled/');
            _path('settingsFile', _path('userData') + '/settings.json');

            // load Settings
            extend(_settings, this.loadJSON(_path('settingsFile')) || {});

            // get or set default locale to load correct language
            // TODO: this will load no text in most locales, need to set a default?
            this.setting('locale', ipc.sendSync('app.getLocale'));

            Engine.Plugin.loadAll();
            this.loadPlugins('game-modifier');
        }

        define(key, value) {
            if (key in this) {
                throw `Can't redefine ${key}, perhaps you need to call extend?.`;
            }
            else {
                this[key] = value;
            }
        }

        setting(key, value) {
            return _settings[key] || (value ? this.setSetting(key, value) : value);
        }

        setSetting(key, value) {
            if (_settings[key] !== value) {
                _settings[key] = value;

                this.saveJSON(_path('settingsFile'), _settings)
            }

            return settings[key];
        }

        loadPlugins(type) {
            const engine = this;
            global.extend = extend;

            if (global.debug) {
                // bit more of a free-for-all, but makes debugging easier as breakpoints work!
                Engine.Plugin.get(type).forEach((plugin) => {
                    (plugin.contents || []).forEach((component) => {
                        document.head.appendChild(((script) => {
                            script.type = 'text/javascript';
                            script.src = 'file://' + component;
                            script.setAttribute('data-package', plugin.package);

                            return script;
                        })(document.createElement('script')));
                    });
                });
            }
            else {
                engine.context = extend({}, global, {
                    fs: fs, // TODO: sandboxed FS - used by renderer to extract images, maybe make that a separate script...
                    require() {
                        throw 'require() is disabled for security reasons.';
                    },
                    // TODO: I'm clearly not supposed to do this...
                    addEventListener(event, method) {
                        global.addEventListener(event, method);
                    },
                    // TODO: ...or this...
                    setInterval(code, delay) {
                        global.setInterval(code, delay);
                    },
                    console: console,
                    global: global,
                    // allows plugins to use these as if they already exist in scope
                    engine: engine,
                    Engine: Engine
                });

                Engine.Plugin.apply(type, engine.context);
            }

            Engine.Plugin.get('style').forEach((plugin) => {
                (plugin.contents || []).forEach((component) => {
                    document.head.appendChild(((link) => {
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.href = 'file://' + component;
                        link.setAttribute('data-package', plugin.package);

                        return link;
                    })(document.createElement('link')))
                });
            });
        }

        start(options) {
            const engine = this;

            if (engine.started) {
                return;
            }

            engine.started = true;

            // TODO: break out
            engine.defaultOptions = {
                // TODO
                players: 3,
                endOfTurn: false
            };

            engine.options = extend({}, engine.defaultOptions, options);

            engine.emit('build');

            engine.on('start', () => engine.emit('turn-start'));

            // TODO: more calculations?
            engine.on('turn-end', () => engine.emit('turn-start'));

            engine.on('turn-over', () => {
                if (this.options.endOfTurn) {
                    console.log('End turn');
                }
            });

            engine.emit('start');

            engine.started = true;
        }

        loadJSON(file) {
            return _loadJSON(file);
        }

        saveJSON(file, data) {
            file = (file.substr(0, 1) === '/') ? file : _path('base') + file;

            return fs.writeFileSync(file, JSON.stringify(data), 'utf8');
        }

        getTemplate(template, callback) {
            const file = template.match(/^\//) ? template : _path('views') + template;
            try {
                fs.accessSync(file);
                return fs.readFileSync(file, 'utf8');
            }
            catch (e) {
                console.error(`Error loading '${_path('views')}${template}': ${e}`);
            }
        }

        getAsset(filter) {
            return (Engine.Plugin.first(filter).contents || [])[0] || new Error('Asset not found: ' + JSON.stringify(filter));
        }

        template(template, vars) {
            return mustache.render(this.getTemplate(template), extend({}, vars, this.templateVars));
        }
    };

    Engine.Plugin = class Plugin {
        constructor(data) {
            extend(this, data);
        }

        get(type, label) {
            const plugin = this;

            return Engine.Plugin.get(type).filter((component) => {
                let check = component.package === plugin.package;

                if (label) {
                    check = check && (component.label === label);
                }

                return check;
            });
        }

        getFirst(type, label) {
            return this.get(type, label)[0];
        }
    };

    extend(Engine.Plugin, {
        apply: (type, context) => {
            Engine.Plugin.get(type).forEach((plugin) => {
                (plugin.contents || []).forEach((component) => {
                    const code = fs.readFileSync(component);
                    // console.log('Loading ' + component);
                    vm.runInContext(code, vm.createContext(extend({
                        plugin: plugin,
                        component: component
                    }, context, plugin, component)), 'file://' + component);
                    // console.log('Loaded ' + component);
                });
            });
        },
        loadAll: () => {
            // skip hidden files
            // TODO: check if file has hidden attribute?
            fs.readdirSync(_path('enabledPlugins')).filter((name) => !(name.match(/^\./)))
            // map each foldername and load the plugin.json for each file
            .map((plugin) => extend({}, _loadJSON(_path('enabledPlugins') +  plugin + '/plugin.json'), {
                // keep the path for use when loading the components
                __path: _path('enabledPlugins') + plugin + '/'
            }))
            // sort by plugin priority
            .sort((a, b) => ((a.priority || 0) > (b.priority || 0)) ? 1 : ((a.priority || 0) === (b.priority || 0)) ? 0 : -1)
            // filter out any plugins missing dependencies
            // TODO: this is proably VERY innefficient, especially the .map()s
            // would be great to order the plugins by some sort of inheritence
            // tree, to ensure dependents are loaded after the dependencies...
            // all dependencies must be matched but only one plugin needs to match the dependency...
            .filter((pluginData, i, pluginArray) => (pluginData.dependencies || []).every((dependency) => pluginArray.some((pluginData) => dependency === pluginData.name)))
            // loop around our final list of dependency checked plugins
            .forEach((pluginData) => {
                _loadedPlugins.push(pluginData.name);
                _pluginPaths[pluginData.name] = pluginData.__path;

                (pluginData.components || []).sort((a, b) => ((a.priority || 0) > (b.priority || 0)) ? 1 : ((a.priority || 0) === (b.priority || 0)) ? 0 : -1).forEach((component) => {
                    // expand content files into full paths for reading
                    component.contents = (component.contents || []).map((file) => {
                        return (file.substr(0) === '/') ? file : (pluginData.__path + file);
                    });

                    component.package = pluginData.name;
                    component.__path = pluginData.__path;

                    if (!(component.type in _pluginTypes)) {
                        _pluginTypes[component.type] = [];
                    }

                    const p = new Engine.Plugin(component);

                    _pluginTypes[component.type].push(p);
                    _plugins.push(p);
                });
            });
        },
        getPath: (plugin) => _pluginPaths[plugin] || new Error(`'${plugin}' not loaded, no path available.`),
        get: (pluginType) => {
            if (typeof pluginType !== 'undefined') {
                return (_pluginTypes[pluginType] || []);
            }
            else {
                return _plugins;
            }
        },
        first: (filters) => {
            return (Engine.Plugin.filter(filters) || [])[0] || new Error('Plugin not found: ' + JSON.stringify(filter));
        },
        filter: (filters) => {
            let filtered = _plugins.slice(0);

            Object.keys(filters).forEach((key) => {
                filtered = filtered.filter((plugin) => {
                    return plugin[key] == filters[key];
                });
            });

            return filtered;
        },
        loaded: (name) => _loadedPlugins.includes(name)
    });


    util.inherits(Engine, EventEmitter);

    return Engine;
})();
