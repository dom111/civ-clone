import Registry from '../core-registry/Registry.js';
// import Tile from './Tile.js';

export class Tileset extends Registry {
  /**
   * @param tiles {...Tile}
   * @returns {Tileset}
   */
  static from(...tiles) {
    return new this(...tiles);
  }

  /**
   * @param tile {Tile}
   * @param radius {number}
   * @returns {Tileset}
   */
  static fromSurrounding(tile, radius = 2) {
    const seen = [],
      /**
       * @param radius {number}
       * @returns {[[number, number]]}
       */
      gen = (radius) => {
        const pairs = [];

        for (let x = tile.x() - radius; x <= tile.x() + radius; x++) {
          for (let y = tile.y() - radius; y <= tile.y() + radius; y++) {
            pairs.push([x, y]);
          }
        }

        return pairs;
      }
    ;

    return new this(...gen(radius)
      .map((coords) => tile.map().get(...coords))
      // strip any duplicates
      .filter((tile) => ! seen.includes(seen.push(tile)))
    );
  }

  /**
   * @param tiles {...Tile}
   */
  constructor(...tiles) {
    // TODO: fix this cyclic dependency
    // super(Tile);
    super(Object);

    this.register(...tiles);
  }

  /**
   * @param tiles {...Tile}
   */
  push(...tiles) {
    this.register(...tiles);
  }

  /**
   * @return {Tile}
   */
  shift() {
    const [first] = this.entries();

    this.unregister(first);

    return first;
  }

  /**
   * @param player {Player}
   * @param values {[[Yield, number]]}
   * @returns {number}
   */
  score({player = null, values} = {}) {
    return this.map((tile) => tile.score({player, values}))
      .reduce((total, score) => total + score, 0)
    ;
  }

  /**
   * @param player {Player}
   * @param yields {Yield[]}
   * @returns {Yield[]}
   */
  yields({player, yields}) {
    return this.entries()
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
  }
}

export default Tileset;
