export class TileImprovement {
  #tile;

  constructor(tile) {
    this.#tile = tile;
  }

  get tile() {
    return this.#tile;
  }
}

export default TileImprovement;
