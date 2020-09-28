export class TransportManifest {
  /** @type {Unit} */
  #transport;
  /** @type {Unit} */
  #unit;

  /**
   * @param transport {Unit}
   * @param unit {Unit}
   */
  constructor({
    transport,
    unit,
  }) {
    this.#transport = transport;
    this.#unit = unit;
  }

  /**
   * @returns {Unit}
   */
  transport() {
    return this.#transport;
  }

  /**
   * @returns {Unit}
   */
  unit() {
    return this.#unit;
  }
}

export default TransportManifest;
