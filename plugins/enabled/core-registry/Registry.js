export class Registry {
  #acceptedTypes = [];
  #entries = [];
  static instances = new Map();

  constructor(...acceptedTypes) {
    this.#acceptedTypes.push(...acceptedTypes);
  }

  accepts(entity) {
    return this.#acceptedTypes.some((accepted) => Object.prototype.isPrototypeOf.call(accepted, entity) ||
      entity instanceof accepted
    );
  }

  entries() {
    return [...this.#entries];
  }

  filter(iterator) {
    return this.#entries.filter(iterator);
  }

  static getInstance() {
    if (! this.instances.get(this)) {
      this.instances.set(this, new this());
    }

    return this.instances.get(this);
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

  get length() {
    return this.#entries.length;
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

  some(iterator) {
    return this.#entries.some(iterator);
  }

  unregister(...entities) {
    entities.forEach((entity) => {
      const index = this.#entries.indexOf(entity);

      if (index > -1) {
        this.#entries.splice(index, 1);
      }
    });
  }
}

export default Registry;