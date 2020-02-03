export class Action {
  #from;
  #to;
  #unit;

  constructor(unit, to, from) {
    this.#from = from;
    this.#to = to;
    this.#unit = unit;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }

  get unit() {
    return this.#unit;
  }
}

export default Action;
