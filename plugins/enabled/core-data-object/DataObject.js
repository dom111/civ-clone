import Registry from '../core-registry/Registry.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class DataObject {
  /** @type {Object} */
  #cachedPlainObject;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  #toPlainObject = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => this.#toPlainObject(item));
    }

    if (value instanceof DataObject) {
      return value.toPlainObject();
    }

    if (value instanceof Registry) {
      return value.entries()
        .map((entry) => this.#toPlainObject(entry))
      ;
    }

    throw new TypeError(`DataObject#toPlainObject: Unsupported object ${value ? value.constructor.name : value}`);
  };

  /**
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#rulesRegistry = rulesRegistry;
  }

  /**
   * @returns {string[]}
   */
  keys() {
    return [];
  }

  /**
   * @returns {Object}
   */
  toPlainObject() {
    if (! this.#cachedPlainObject) {
      this.#cachedPlainObject = this.keys()
        .reduce((object, key) => {
          object[key] = this.#toPlainObject((typeof this[key] === 'function') ?
            this[key]() :
            this[key]
          );

          return object;
        }, {})
      ;

      this.#rulesRegistry
        .process(`data:${this.constructor.name}`, this)
        .forEach(([key, value]) => this.#cachedPlainObject[key] = value)
      ;
    }

    return this.#cachedPlainObject;
  }
}

export default DataObject;
