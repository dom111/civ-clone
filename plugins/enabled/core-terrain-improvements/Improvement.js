export class Improvement {
  static #improvements = {};

  static register(constructor) {
    this.#improvements[constructor.name] = constructor;

    engine.emit('terrain-improvement:registered', constructor);
  }

  static availableOn(terrain) {
    // TODO: use RulesRegistry so things like rivers necessitate Bridge Building
    return this.available.some((constructor) => terrain instanceof constructor);
  }
}

export default Improvement;