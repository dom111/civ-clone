import {Component} from './Plugin/Components.js';

export class Plugin {
  #data;
  #components = [];

  constructor(data) {
    this.#data = {
      dependencies: [],
      ...data,
    };
  }

  get components() {
    if (this.#components.length !== this.data.components.length) {
      this.#components = this.data.components.map((component) => Component.fromType({data: component, plugin: this}));
    }

    return this.#components;
  }

  get data() {
    return this.#data;
  }

  get dependencies() {
    return this.data.dependencies;
  }

  set dependencies(dependencies) {
    return this.data.dependencies = dependencies;
  }

  get file() {
    return this.data.file;
  }

  get name() {
    if (! this.data) {
      console.error(this);
    }

    return this.data.name;
  }

  get path() {
    return this.data.path;
  }

  get priority() {
    return this.data.priority;
  }

  get version() {
    return this.plugin.version;
  }
}

export default Plugin;