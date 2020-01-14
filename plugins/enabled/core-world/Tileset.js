export class Tileset {
  #tiles;

  static from(...tiles) {
    return new this(...tiles);
  }

  static fromSurrounding(tile, radius = 2) {
    const tileX = tile.x,
      tileY = tile.y,
      seen = [],
      gen = (max, pairs = [[0, 0]]) => {
        for (let i = 0; i <= max * max; i++) {
          const x = Math.floor(i / max),
            y = i % max
          ;

          pairs.push([tileX + x, tileY + y]);

          if (x > 0) {
            pairs.push([tileX - x, tileY + y]);
          }

          if (y > 0) {
            pairs.push([tileX + x, tileY - y], [tileX - x, tileY - y]);
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

  cities() {
    return this
      .filter((tile) => tile.city)
      .map((tile) => tile.city)
    ;
  }

  constructor(...tiles) {
    this.#tiles = tiles;
  }

  every(iterator) {
    return this.#tiles.every(iterator);
  }

  filter(iterator) {
    return this.#tiles.filter(iterator);
  }

  includes(tile) {
    return this.#tiles.includes(tile);
  }

  map(iterator) {
    return this.#tiles.map(iterator);
  }

  push(...tiles) {
    this.#tiles.push(...tiles);
  }

  some(iterator) {
    return this.#tiles.some(iterator);
  }

  sum(field) {
    return this.map((tile) => tile[field]).reduce((total, tile) => total + tile, 0);
  }

  get food() {
    return this.sum('food');
  }

  get production() {
    return this.sum('production');
  }

  get trade() {
    return this.sum('trade');
  }

  score({
    food = 4,
    production = 2,
    trade = 1,
  } = {}) {
    return this.map((tile) => tile.score({
      food,
      production,
      trade,
    }))
      .reduce((total, score) => total + score, 0)
    ;
  }
}

export default Tileset;