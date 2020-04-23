export class Interaction {
  /** @type {Player[]} */
  #players = [];

  /**
   * @param players {Player[]}
   */
  constructor(...players) {
    this.#players.push(...players);
  }

  /**
   * @param players {Player}
   * @returns {boolean}
   */
  isBetween(...players) {
    return players.every((player) => this.#players.includes(player)) &&
      players.length === this.#players.length
    ;
  }

  /**
   * @returns {Player[]}
   */
  players() {
    return this.#players;
  }
}

export default Interaction;
