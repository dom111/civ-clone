import EventEmitter from 'events';
import Manager from './Plugin/Manager.js';
import {promises as fs} from 'fs';
import loadJSON from './lib/loadJSON.js';
import path from 'path';
import saveJSON from './lib/saveJSON.js';

export class Engine extends EventEmitter {
  #data = {};
  #debug = global.debug || false;
  #options = {};
  #paths = {};
  #pluginManager;
  #settings = {};

  constructor() {
    super();

    this.#pluginManager = new Manager(this);

    // set up useful paths
    this.path('base', './');
    this.path('views', this.path('base'), 'views');
    this.path('plugins', this.path('base'), 'plugins');
    this.path('enabledPlugins', this.path('plugins'), 'enabled');

    // TODO: store in userHome/userData
    this.path('settingsFile', this.path('base'), 'civ.settings.json');
    // this.path('userHome', process.env.HOME);
    // this.path('settingsFile', this.path('userHome'), 'civ.settings.json');
  }

  emit(event, ...args) {
    this.#debug && console.log(`${event}: ${args}`);

    super.emit(event, ...args);
  }

  async loadPlugins() {
    return await this.#pluginManager.load();
  }

  async loadSettings() {
    try {
      // check if the settings file exists
      await fs.access(this.path('settingsFile'));
    }
    catch (e) {
      // create the file if not
      this.saveJSON({}, this.path('settingsFile'));
    }

    const settings = await this.loadJSON(this.path('settingsFile'));

    Object.entries(settings)
      .forEach(([key, value]) => this.setSetting(key, value))
    ;

    // get or set default locale to load correct language
    // TODO: detect default locale
    this.setSetting('locale', 'en-GB');
  }

  path(key, ...parts) {
    if (parts.length) {
      this.#paths[key] = path.resolve(...parts);
    }

    return (key in this.#paths) ? this.#paths[key] : '';
  }

  // settings are persistent game settings that are saved
  setting(key, defaultValue) {
    return this.#settings[key] || defaultValue;
  }

  setSetting(key, value) {
    if (this.#settings[key] !== value) {
      this.#settings[key] = value;

      this.saveJSON(this.#settings, this.path('settingsFile'));

      this.emit('setting:changed', key, value);
    }
  }

  // options are per-game settings that affect only the current game
  option(key, defaultValue) {
    return this.#options[key] || defaultValue;
  }

  setOption(key, value) {
    if (this.#options[key] !== value) {
      this.#options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  // data is ethereal game data used in the current game
  data(key, defaultValue) {
    return this.#data[key] || defaultValue;
  }

  setData(key, value) {
    if (this.#data[key] !== value) {
      this.#data[key] = value;

      this.emit('data:changed', key, value);
    }
  }

  async start() {
    if (this.started) {
      return;
    }

    await this.loadSettings();
    await this.loadPlugins();

    this.started = true;

    this.emit('build');
    this.emit('start');
    this.started = true;
  }

  loadJSON(...parts) {
    return loadJSON(path.join(...parts));
  }

  saveJSON(data, ...parts) {
    return saveJSON(path.join(...parts), data);
  }
}

export default Engine;
