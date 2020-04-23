export class PlayerAction {
  #value;

  constructor(value) {
    this.#value = value;
  }

  value() {
    return this.#value;
  }
}

export default PlayerAction;
