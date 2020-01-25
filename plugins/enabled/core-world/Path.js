import Tile from './Tile.js';

export class Path {
  #tiles = [];

  constructor(...tiles) {
    this.push(...tiles);
  }

  start() {
    return this.#tiles[0];
  }

  get length() {
    return this.#tiles.length;
  }

  push(...tiles) {
    tiles.forEach((tile) => {
      if (! (tile instanceof Tile)) {
        throw new TypeError(`Tile#push: Invalid element passed, expected 'Tile' got '${tile && tile.constructor.name}'.`);
      }

      if (this.#tiles.length === 0 || this.top().isNeighbourOf(tile)) {
        this.#tiles.push(tile);
      }
    });
  }

  shift() {
    return this.#tiles.shift();
  }

  end() {
    return this.#tiles[this.#tiles.length - 1];
  }
}

export default Path;
