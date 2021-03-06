export class Effect {
  /** @type {function} */
  #effect;

  /**
   * @param effect {function}
   */
  constructor(effect) {
    if (! (typeof effect === 'function')) {
      throw new TypeError(`Effect: invalid effect. Expected function got '${typeof effect}'.`);
    }

    this.#effect = effect;
  }

  apply(...args) {
    return this.#effect(...args);
  }
}

export default Effect;