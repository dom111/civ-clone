export class UnitImprovement {
  /** @type {Unit} */
  #unit;

  /**
   * @param unit {Unit}
   */
  constructor(unit) {
    this.#unit = unit;
  }

  /**
   * @returns {Unit}
   */
  unit() {
    return this.#unit;
  }
}

export default UnitImprovement;
