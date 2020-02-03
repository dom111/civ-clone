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

  emit(event, ...args) {
    this.option('debug') && console.log(`Engine#emit: ${event}: ${args}`);

    super.emit(event, ...args);
  }

  async loadPlugins() {
    this.emit('engine:plugins:load');
    await this.#pluginManager.load();
    this.emit('engine:plugins-loaded');
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

  async start() {
    if (this.started) {
      return;
    }

    this.started = true;

    this.emit('engine:initialise');

    await this.loadPlugins();

    this.emit('engine:start');
  }

  loadJSON(...parts) {
    return loadJSON(path.join(...parts));
  }
}

export default Engine;
