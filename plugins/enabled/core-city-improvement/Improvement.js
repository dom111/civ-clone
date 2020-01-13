export default class Improvement {
  static #improvements = [];

  constructor({city}) {
    // this.#built = engine.turn; // TODO: import Time and use Time.turn
    city.improvements.push(this);

    engine.emit('city-improvement:built', city, this);
  }

  static register(constructor) {
    if (! this.#improvements.includes(constructor)) {
      this.#improvements.push(constructor);

      engine.emit('city-improvement:registered', constructor);
    }
  }
}
