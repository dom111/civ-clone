import {Component} from './Plugin/Components.js';

export class Plugin {
  /** @type {{}} */
  #data;
  /** @type {Component[]} */
  #components = [];

  /**
   * @param data {{}}
   */
  constructor(data) {
    this.#data = {
      dependencies: [],
      ...data,
    };
  }

  /**
   * @returns {({}|Component)[]}
   */
  get components() {
    if (this.#components.length !== (this.data.components || []).length) {
      this.#components = this.data.components.map((component) => Component.fromType({data: component, plugin: this}));
    }

    return this.#components;
  }

  /**
   * @returns {{}}
   */
  get data() {
    return this.#data;
  }

  /**
   * @returns {({}|Plugin)[]}
   */
  get dependencies() {
    return this.data.dependencies;
  }

  /**
   * @param dependencies {({}|Plugin)[]}
   */
  set dependencies(dependencies) {
    this.data.dependencies = dependencies;
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
  get name() {
    if (! this.data) {
      console.error(this);
    }

    return this.data.name;
  }

  /**
   * @returns {string}
   */
  get path() {
    return this.data.path;
  }

  /**
   * @returns {string}
   */
  get version() {
    return this.plugin.version;
  }
}

export default Plugin;