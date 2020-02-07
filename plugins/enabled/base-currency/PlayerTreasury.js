export class PlayerTreasury {
  #player;
  #value = 0;

  constructor(player) {
    this.#player = player;
  }

  add(amount) {
    this.#value += amount;
  }

  get player() {
    return this.#player;
  }

  remove(amount) {
    this.#value -= amount;
  }

  value() {
    return Math.floor(this.#value);
  }

  valueOf() {
    return this.#value;
  }
}

export default PlayerTreasury;