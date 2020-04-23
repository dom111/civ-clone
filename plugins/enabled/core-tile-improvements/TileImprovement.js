export class TileImprovement {
  /** @type {Tile} */
  #tile;

  /**
   * @param tile {Tile}
   */
  constructor(tile) {
    this.#tile = tile;
  }

  /**
   * @returns {Tile}
   */
  tile() {
    return this.#tile;
  }
}

export default TileImprovement;
