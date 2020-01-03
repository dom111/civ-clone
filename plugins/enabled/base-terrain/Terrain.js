export class Terrain {
  static #terrains = {};

  name = 'terrain';
  title = 'Terrain';

  food = 0;
  movementCost = 1;
  production = 0;
  special = [];
  trade = 0;

  static fromName(name, ...args) {
    if (! (name in this.#terrains)) {
      throw new TypeError(`Unknown Terrain: '${name}'.`);
    }

    return new (this.#terrains[name])(...args);
  }

  static register(constructor) {
    if (constructor.name in this.#terrains) {
      throw new TypeError(`Terrain type '${constructor.name}' already exists.`);
    }

    this.#terrains[constructor.name] = constructor;
  }

  static get terrains() {
    return [
      ...Object.values(this.#terrains)
    ];
  }

  constructor() {
    this.applySpecial();
  }

  applySpecial() {
    if (this.special.length) {
      const special = this.special[Math.floor(this.special.length * Math.random())];

      if (Math.random() >= special.chance) {
        Object.entries(special).forEach(([key, value]) => this[key] = value);
      }
    }
  }
}

export default Terrain;