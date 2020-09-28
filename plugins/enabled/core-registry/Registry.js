export class Registry {
  /** @type {Class[]} */
  #acceptedTypes = [];
  #entries = [];
  static instances = new Map();

  constructor(...acceptedTypes) {
    this.#acceptedTypes.push(...acceptedTypes);
  }

  /**
   * @returns {boolean}
   */
  accepts(entity) {
    return this.#acceptedTypes.some((accepted) => Object.prototype.isPrototypeOf.call(accepted, entity) ||
      entity instanceof accepted
    );
  }

  entries() {
    return this.#entries
      .filter((entry) => entry !== null)
    ;
  }

  /**
   * @returns {boolean}
   */
  every(iterator) {
    return this.entries()
      .every(iterator)
    ;
  }

  filter(iterator) {
    return this.entries()
      .filter(iterator)
    ;
  }

  forEach(iterator) {
    return this.entries()
      .forEach(iterator)
    ;
  }

  /**
   * @returns {Registry}
   */
  static getInstance() {
    if (! this.instances.get(this)) {
      this.instances.set(this, new this());
    }

    return this.instances.get(this);
  }

  get(i) {
    return this.#entries[i];
  }

  getBy(key, value) {
    return this.filter((entity) => {
      const check = entity[key];

      if (typeof check === 'function') {
        return check.bind(entity)() === value;
      }

      return entity[key] === value;
    });
  }

  /**
   * @returns {boolean}
   */
  includes(tile) {
    return this.#entries.includes(tile);
  }

  /**
   * @returns {number}
   */
  indexOf(entity) {
    return this.#entries.indexOf(entity);
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.entries()
      .length
    ;
  }

  map(iterator) {
    return this.entries()
      .map(iterator)
    ;
  }

  register(...entities) {
    entities.forEach((entity) => {
      if (! this.accepts(entity)) {
        throw new TypeError(`Registry#register: Invalid entity attempted to be registered: '${entity}'.`);
      }

      if (! this.#entries.includes(entity)) {
        this.#entries.push(entity);
      }
    });
  }

  /**
   * @returns {boolean}
   */
  some(iterator) {
    return this.entries()
      .some(iterator)
    ;
  }

  unregister(...entities) {
    entities.forEach((entity) => {
      const index = this.#entries.indexOf(entity);

      if (index > -1) {
        this.#entries.splice(index, 1, null);
      }
    });
  }
}

export default Registry;
