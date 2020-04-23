import Yield from '../core-yields/Yield.js';

export class Turn extends Yield {
  /** @type {Turn} */
  static #instance;

  /**
   * @override
   */
  add() {}

  /**
   * @override
   */
  addModifier() {}

  /**
   * @returns {Turn}
   */
  static getInstance() {
    if (! this.#instance) {
      this.#instance = new this();
    }

    return this.#instance;
  }

  /**
   * @returns {number}
   */
  increment() {
    super.add(1);

    return this.value();
  }

  /**
   * @override
   */
  set() {}

  /**
   * @override
   */
  subtract() {}
}

export default Turn;
