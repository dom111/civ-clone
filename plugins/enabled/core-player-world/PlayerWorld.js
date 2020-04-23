import UndiscoveredTile from './UndiscoveredTile.js';

export class PlayerWorld {
  /** @type {number} */
  #height;
  /** @type {Player} */
  #player;
  /** @type {number} */
  #width;

  /**
   * @param height {number}
   * @param player {Player}
   * @param width {number}
   */
  constructor({
    height,
    player,
    width,
  }) {
    this.#height = height;
    this.#player = player;
    this.#width = width;
  }

  /**
   * @returns {Tile}
   */
  get(x, y) {
    const [tile] = this.player()
      .seenTiles()
      .filter((tile) => tile.x() === x && tile.y() === y)
    ;

    if (tile) {
      return tile;
    }

    return new UndiscoveredTile({
      x,
      y,
    });
  }

  /**
   * @returns {number}
   */
  height() {
    return this.#height;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @returns {number}
   */
  width() {
    return this.#width;
  }
}

export default PlayerWorld;
