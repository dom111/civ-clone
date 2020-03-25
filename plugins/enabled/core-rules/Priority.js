export class Priority {
  #value;

  constructor(value = 2000) {
    this.#value = value;
  }

  value() {
    return this.#value;
  }

  valueOf() {
    return this.value();
  }
}

export default Priority;
