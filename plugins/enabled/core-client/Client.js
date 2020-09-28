export class Client {
  /** @type {World} */
  #map;
  /** @type {Player} */
  #player;

  /**
   * @param player {Player}
   */
  constructor({
    player,
  }) {
    this.#player = player;
  }

  /**
   * @return {World}
   */
  map() {
    return this.#map;
  }

  /**
   * @return {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @return {Promise}
   */
  takeTurn() {
    return new Promise((resolve, reject) => {
      reject(new TypeError('Client#takeTurn must be implemented.'));
    });
  }
}

export default Client;
