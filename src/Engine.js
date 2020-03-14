import EventEmitter from 'events';
import Manager from './Plugin/Manager.js';
import loadJSON from './lib/loadJSON.js';
import path from 'path';

export class Engine extends EventEmitter {
  #defaultPaths = {
    base: './',
    plugins: 'plugins/enabled',
  };
  #options = {
    manifestName: 'plugin.json',
  };
  #paths = {};
  #pluginManager;

  constructor(paths = {}) {
    super();

    this.#pluginManager = new Manager(this);

    // base path is a special case and needs to be set first
    const {base, ...mergedPaths} = {
      ...this.#defaultPaths,
      ...paths,
    };

    this.path('base', base);

    Object.entries(mergedPaths)
      .forEach(([key, value]) => this.path(key, this.path('base'), value))
    ;
  }

  debug(callback) {
    if (! this.option('debug')) {
      return;
    }

    return callback();
  }

  emit(event, ...args) {
    this.debug(() => console.log(`Engine#emit: ${event}: ${args}`));

    super.emit(event, ...args);
  }

  loadPlugins() {
    this.emit('engine:plugins:load');

    return this.#pluginManager.load()
      .then(() => this.emit('engine:plugins-loaded'))
    ;
  }

  path(key, ...parts) {
    if (parts.length) {
      this.#paths[key] = path.resolve(...parts);
      this.emit('path:changed', key, this.#paths[key]);
    }

    return (key in this.#paths) ? this.#paths[key] : '';
  }

  // options are per-instance settings that affect only the current instance
  option(key, defaultValue) {
    return this.#options[key] || defaultValue;
  }

  setOption(key, value) {
    if (this.#options[key] !== value) {
      this.#options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  start() {
    if (this.started) {
      return;
    }

    this.started = true;

    this.emit('engine:initialise');

    return this.loadPlugins()
      .then(() => this.emit('engine:start'))
    ;
  }

  loadJSON(...parts) {
    return loadJSON(path.join(...parts));
  }
}

export default Engine;
