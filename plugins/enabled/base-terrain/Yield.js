export class Yield {
  #value = 0;

  add(n) {
    this.#value += n;
  }

  subtract(n) {
    this.#value -= n;
  }

  get value() {
    return this.#value;
  }

  valueOf() {
    return this.value;
  }
}

export default Yield;