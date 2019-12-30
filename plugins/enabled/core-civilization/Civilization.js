export default class Civilization {
  static #civilizations = {};

  static fromName(name, ...args) {
    if (! (name in this.#civilizations)) {
      throw new TypeError(`Unknown Civilization: '${name}'.`);
    }

    return new (this.#civilizations[name])(...args);
  }

  static register(constructor) {
    this.#civilizations[constructor.name] = constructor;
  }

  static get civilizations() {
    return [
      ...Object.values(this.#civilizations)
    ];
  }
}
