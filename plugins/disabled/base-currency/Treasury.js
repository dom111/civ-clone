export class Treasury {
  #gold;

  add(amount) {
    this.#gold += amount;
  }

  remove(amount) {
    this.#gold -= amount;
  }

  valueOf() {
    return this.#gold;
  }
}

export default Treasury;