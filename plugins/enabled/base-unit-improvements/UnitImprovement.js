export class UnitImprovement {
  #unit;

  constructor(unit) {
    this.#unit = unit;
  }

  unit() {
    return this.#unit;
  }
}

export default UnitImprovement;
