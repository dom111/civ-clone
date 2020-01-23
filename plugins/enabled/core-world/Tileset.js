import YieldRegistry from '../core-yields/Registry.js';

export class Tileset {
  #tiles;

  static from(...tiles) {
    return new this(...tiles);
  }

  static fromSurrounding(tile, radius = 2) {
    const seen = [],
      gen = (radius) => {
        const pairs = [];

        for (let x = tile.x - radius; x <= tile.x + radius; x++) {
          for (let y = tile.y - radius; y <= tile.y + radius; y++) {
            pairs.push([x, y]);
          }
        }

        return pairs;
      }
    ;

    // strip out the corners
    return new this(...gen(radius)
      .map((coords) => tile.map.get(...coords))
      // strip any duplicates
      .filter((tile) => ! seen.includes(seen.push(tile)))
    );
  }

  constructor(...tiles) {
    this.#tiles = tiles;
  }

  cities() {
    return this
      .filter((tile) => tile.city)
      .map((tile) => tile.city)
    ;
  }

  every(iterator) {
    return this.#tiles.every(iterator);
  }

  filter(iterator) {
    return this.#tiles.filter(iterator);
  }

  forEach(iterator) {
    return this.#tiles.forEach(iterator);
  }

  includes(tile) {
    return this.#tiles.includes(tile);
  }

  get length() {
    return this.#tiles.length;
  }

  map(iterator) {
    return this.#tiles.map(iterator);
  }

  push(...tiles) {
    this.#tiles.push(...tiles);
  }

  score(values) {
    return this.map((tile) => tile.score(values))
      .reduce((total, score) => total + score, 0)
    ;
  }

  some(iterator) {
    return this.#tiles.some(iterator);
  }

  yields(yields = YieldRegistry.entries().map((YieldType) => new YieldType())) {
    yields.forEach((tileYield) => this.#tiles.forEach((tile) => tile.resource(tileYield)));

    return yields;
  }
}

export default Tileset;
