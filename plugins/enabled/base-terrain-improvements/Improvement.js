export class Improvement {
  static #improvements = {};

  static register(constructor) {
    this.#improvements[constructor.name] = constructor;

    engine.emit('terrain-improvement:registered', constructor);
  }
}

export default Improvement;