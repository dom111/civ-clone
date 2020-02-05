export class Registry {
  #acceptedTypes = [];
  #entries = [];

  constructor(...acceptedTypes) {
    this.#acceptedTypes.push(...acceptedTypes);
  }

  accepts(entity) {
    return this.#acceptedTypes.some((accepted) => {
      if (typeof entity === 'function') {
        return Object.prototype.isPrototypeOf.call(accepted, entity);
      }
      else {
        return entity instanceof accepted;
      }
    });
  }

  entries() {
    return [...this.#entries];
  }

  filter(iterator) {
    return this.#entries.filter(iterator);
  }

  getBy(key, value) {
    return this.filter((entity) => entity[key] === value);
  }

  register(entity) {
    if (! this.accepts(entity)) {
      throw new TypeError(`Invalid entity attempted to be registered: ${entity}`);
    }

    if (! this.#entries.includes(entity)) {
      this.#entries.push(entity);
    }
  }

  unregister(entity) {
    const index = this.#entries.indexOf(entity);

    if (index > -1) {
      this.#entries.splice(index, 1);
    }
  }
}

export default Registry;