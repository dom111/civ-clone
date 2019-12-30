import {Data, File, Script} from './Components.js';
import path from 'path';
import promiseFactory from '../lib/promiseFactory.js';

export class Component {
  #data;
  #plugin;
  #result;

  constructor({data, plugin}) {
    this.#data = data;
    this.#plugin = plugin;
  }

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

  run(context = {}, resolver) {
    return this.#result = promiseFactory(async (resolve, reject) => {
      try {
        const module = await this.process(this.fullPath, context, resolver);

        resolve(module);
      }
      catch (e) {
        reject(e);
      }
    });
  }

  get data() {
    return this.#data;
  }

  get file() {
    return this.data.file;
  }

  get fullPath() {
    return path.join(this.path, this.file);
  }

  get name() {
    if (! this.plugin) {
      console.error(this);
    }

    return this.plugin.name;
  }

  get path() {
    return this.plugin.path;
  }

  get plugin() {
    return this.#plugin;
  }

  get priority() {
    return this.data.priority;
  }

  get result() {
    return this.#result;
  }

  get type() {
    return this.data.type;
  }

  get version() {
    return this.plugin.version;
  }
}

export default Component;