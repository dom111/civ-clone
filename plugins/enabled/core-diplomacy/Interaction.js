export class Interaction {
  #players = [];

  constructor(...players) {
    this.#players.push(...players);
  }

  isBetween(...players) {
    return players.every((player) => this.#players.includes(player)) &&
      players.length === this.#players.length
    ;
  }

  players() {
    return this.#players;
  }
}

export default Interaction;
