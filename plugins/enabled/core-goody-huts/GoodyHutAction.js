export class GoodyHutAction {
  /** @type {GoodyHut} */
  #goodyHut;
  /** @type {Unit} */
  #unit;

  /**
   * @param goodyHut {GoodyHut}
   * @param unit {Unit}
   */
  constructor({
    goodyHut,
    unit,
  }) {
    this.#goodyHut = goodyHut;
    this.#unit = unit;
  }

  /**
   * @returns {GoodyHut}
   */
  goodyHut() {
    return this.#goodyHut;
  }

  perform() {}

  /**
   * @returns {Unit}
   */
  unit() {
    return this.#unit;
  }
}

export default GoodyHutAction;
