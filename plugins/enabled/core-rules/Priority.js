export class Priority {
  /** @type {number} */
  #value;

  /**
   * @param value {number}
   */
  constructor(value = 2000) {
    this.#value = value;
  }

  /**
   * @returns {number}
   */
  value() {
    return this.#value;
  }

  /**
   * @returns {number}
   */
  valueOf() {
    return this.value();
  }
}

export default Priority;
