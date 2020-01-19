export class Registry {
  #acceptedTypes = [];
  #namespace;
  #registry = [];

  constructor(namespace, ...acceptedTypes) {
    this.#namespace = namespace;
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

  get entries() {
    return [...this.#registry];
  }

  filter(iterator) {
    return this.#registry.filter(iterator);
  }

  register(entity) {
    if (! this.accepts(entity)) {
      throw new TypeError(`Invalid entity attempted to be registered in ${this.#namespace} registry. (${entity})`);
    }

    if (! this.#registry.includes(entity)) {
      this.#registry.push(entity);
    }

    engine.emit(`${this.#namespace}:registered`, entity);
  }

  unregister(entity) {
    const index = this.#registry.indexOf(entity);

    if (index > -1) {
      this.#registry.splice(index, 1);

      engine.emit(`${this.#namespace}:unregistered`, entity);
    }
  }
}

export default Registry;