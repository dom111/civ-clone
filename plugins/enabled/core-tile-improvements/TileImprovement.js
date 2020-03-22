export class TileImprovement {
  #tile;

  constructor(tile) {
    this.#tile = tile;
  }

  tile() {
    return this.#tile;
  }
}

export default TileImprovement;
