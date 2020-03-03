export class UnitImprovement {
  #unit;

  constructor(unit) {
    this.#unit = unit;
  }

  get unit() {
    return this.#unit;
  }
}

export default UnitImprovement;
