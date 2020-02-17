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

  score({player = null, values}) {
    return this.map((tile) => tile.score({player, values}))
      .reduce((total, score) => total + score, 0)
    ;
  }

  some(iterator) {
    return this.#tiles.some(iterator);
  }

  yields(player) {
    return this.#tiles
      .reduce((yields, tile) => {
        tile.yields(player)
          .forEach((tileYield) => {
            const [existingYield] = yields.filter((existingYield) => existingYield instanceof (tileYield.constructor));

            if (existingYield) {
              existingYield.add(tileYield);

              return;
            }

            const newYield = new (tileYield.constructor)(tileYield);

            yields.push(newYield);
          })
        ;

        return yields;
      }, [])
    ;
  }
}

export default Tileset;
