export class TransportManifest {
  #transport;
  #unit;

  constructor({
    transport,
    unit,
  }) {
    this.#transport = transport;
    this.#unit = unit;
  }

  transport() {
    return this.#transport;
  }

  unit() {
    return this.#unit;
  }
}

export default TransportManifest;
