export class GoodyHutAction {
  #goodyHut;
  #unit;

  constructor({
    goodyHut,
    unit,
  }) {
    this.#goodyHut = goodyHut;
    this.#unit = unit;
  }

  goodyHut() {
    return this.#goodyHut;
  }

  perform() {}

  unit() {
    return this.#unit;
  }
}

export default GoodyHutAction;