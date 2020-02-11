export class Improvement {
  #city;
  #player;

  constructor({player, city}) {
    this.#player = player;
    this.#city   = city;

    engine.emit('city-improvement:created', this, city);
  }

  get city() {
    return this.#city;
  }

  get player() {
    return this.#player;
  }
}

export default Improvement;
