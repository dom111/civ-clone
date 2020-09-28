import {Data, File, Script} from './Components.js';
import path from 'path';

export class Component {
  /** @type {{}} */
  #data;
  /** @type {Plugin} */
  #plugin;
  /** @type Promise<vm.Module> */
  #result;

  /**
   * @param data {{}}
   * @param plugin {Plugin}
   */
  constructor({data, plugin}) {
    this.#data = data;
    this.#plugin = plugin;
  }

  /**
   * @param data {{}}
   * @param plugin {Plugin}
   * @returns {Script|File|Data}
   */
  static fromType({data, plugin}) {
    if (data.type === 'data') {
      return new Data({data, plugin});
    }

    if (data.type === 'file') {
      return new File({data, plugin});
    }

    if (data.type === 'script') {
      return new Script({data, plugin});
    }

    throw new TypeError(`Can't create component of type '${data.type}'.`);
  }

  /**
   * @param context {{}}
   * @param resolver {function}
   * @returns {Promise<vm.Module>}
   */
  run(context = {}, resolver) {
    return this.#result = this.process(this.fullPath, context, resolver);
  }

  /**
   * @returns {{}}
   */
  get data() {
    return this.#data;
  }

  /**
   * @returns {string}
   */
  get file() {
    return this.data.file;
  }

  /**
   * @returns {string}
   */
  get fullPath() {
    return path.join(this.path, this.file);
  }

  /**
   * @returns {string}
   */
  get name() {
    if (! this.plugin) {
      console.error(this);
    }

    return this.plugin.name;
  }

  /**
   * @returns {string}
   */
  get path() {
    return this.plugin.path;
  }

  /**
   * @returns {Plugin}
   */
  get plugin() {
    return this.#plugin;
  }

  /**
   * @returns {Promise<vm.Module>}
   */
  get result() {
    return this.#result;
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.data.type;
  }

  /**
   * @returns {string}
   */
  get version() {
    return this.plugin.version;
  }
}

export default Component;