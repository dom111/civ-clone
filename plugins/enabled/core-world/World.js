import Registry from '../core-registry/Registry.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tile from './Tile.js';

export class World extends Registry {
  /** @type {Generator} */
  #generator;
  /** @type {number} */
  #height;
  /** @type {number} */
  #width;

  /**
   * @param generator {Generator}
   */
  constructor(generator) {
    super(Tile);

    this.#generator = generator;
    this.#height = generator.height();
    this.#width = generator.width();
  }

  /**
   * @param rulesRegistry {RulesRegistry}
   */
  build({
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    this.#generator.generate()
      .forEach((terrain, i) => {
        const tile = new Tile({
          x: i % this.#width,
          y: Math.floor(i / this.#width),
          terrain,
          map: this,
          rulesRegistry,
        });

        this.register(tile);
      })
    ;
  }

  /**
   * @returns {Tile}
   */
  get(x, y) {
    return super.get(this.#generator.coordsToIndex(x, y));
  }

  /**
   * @returns {number}
   */
  height() {
    return this.#height;
  }

  // static load(data) {
  //   this.#map = data.map((tileData) => Tile.load(tileData));
  // }

  // save() {
  //   return this.#map.map((tile) => tile.save())
  // }

  /**
   * @returns {number}
   */
  width() {
    return this.#width;
  }
}

export default World;