export class YieldModifier {
  #apply;
  #priority;

  constructor(apply, priority = 0) {
    this.#apply = apply;
    this.#priority = priority;
  }

  apply(value) {
    return this.#apply(value);
  }

  priority() {
    return this.#priority;
  }
}

export default YieldModifier;
