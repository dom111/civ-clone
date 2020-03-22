export class Tileset {
  #tiles = [];

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
    this.push(...tiles);
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

  get(i) {
    return this.#tiles[i];
  }

  includes(tile) {
    return this.#tiles.includes(tile);
  }

  // this makes sense as a getter as it's just a facade to the underlying Array.
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

  shift() {
    return this.#tiles.shift();
  }

  some(iterator) {
    return this.#tiles.some(iterator);
  }

  yields({player, yields}) {
    const finalYields =  this.#tiles
      .reduce((tilesetYields, tile) => {
        tile.yields({
          player,
          yields,
        })
          .forEach((tileYield) => {
            const [existingYield] = tilesetYields.filter((existingYield) => existingYield instanceof (tileYield.constructor));

            if (existingYield) {
              existingYield.add(tileYield);

              return;
            }

            const newYield = new (tileYield.constructor)(tileYield);

            tilesetYields.push(newYield);
          })
        ;

        return tilesetYields;
      }, yields.map((Yield) => new Yield()))
    ;

    return finalYields;
  }
}

export default Tileset;
