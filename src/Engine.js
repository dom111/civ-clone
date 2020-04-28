import EventEmitter from 'events';
import Manager from './Plugin/Manager.js';
import loadJSON from './lib/loadJSON.js';
import path from 'path';

export class Engine extends EventEmitter {
  /** @type {{plugins: string, base: string}} */
  #defaultPaths = {
    base: './',
    plugins: 'plugins/enabled',
  };
  /** @type {{manifestName: string}} */
  #options = {
    manifestName: 'plugin.json',
  };
  /** @type {{}} */
  #paths = {};
  /** @type Manager */
  #pluginManager;

  /**
   * @param paths {{}}
   */
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

  /**
   * @param callback {function}
   */
  debug(callback) {
    if (! this.option('debug')) {
      return;
    }

    return callback();
  }

  /**
   * @param event {string}
   * @param args
   */
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

  /**
   * @param key {string}
   * @param parts {string}
   * @returns {string}
   */
  path(key, ...parts) {
    if (parts.length) {
      this.#paths[key] = path.resolve(...parts);
      this.emit('path:changed', key, this.#paths[key]);
    }

    return (key in this.#paths) ? this.#paths[key] : '';
  }

  /**
   * Options are per-instance settings that affect only the current instance.
   *
   * @param key {string}
   * @param defaultValue
   */
  option(key, defaultValue) {
    return this.#options[key] || defaultValue;
  }

  /**
   * @param key {string}
   * @param value
   */
  setOption(key, value) {
    if (this.#options[key] !== value) {
      this.#options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
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

  /**
   * @param parts string
   * @returns {Promise<{}>}
   */
  loadJSON(...parts) {
    return loadJSON(path.join(...parts));
  }
}

export default Engine;
