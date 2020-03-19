import Yield from '../core-yields/Yield.js';

export class Turn extends Yield {
  static #instance;

  add() {}

  addModifier() {}

  static getInstance() {
    if (! this.#instance) {
      this.#instance = new this();
    }

    return this.#instance;
  }

  increment() {
    super.add(1);

    return this.value();
  }

  set() {}

  subtract() {}
}

export default Turn;
