import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tile from './Tile.js';

export class World {
  #generator;
  #height;
  #map;
  #width;

  constructor(generator) {
    this.#generator = generator;
    this.#height = generator.height();
    this.#width = generator.width();

    // TODO: use this to help generate consistent maps
    this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = 615489;
  }

  build({
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    const rawMap = this.#generator.generate();

    this.#map = rawMap
      .map((terrain, i) => new Tile({
        x: i % this.#width,
        y: Math.floor(i / this.#width),
        terrain,
        map: this,
        rulesRegistry,
      }))
    ;
  }

  get(x, y) {
    return this.#map[this.#generator.coordsToIndex(x, y)];
  }

  getBy(filterFunction) {
    return this.#map.filter(filterFunction);
  }

  height() {
    return this.#height;
  }

  // static load(data) {
  //   this.#map = data.map((tileData) => Tile.load(tileData));
  // }

  // save() {
  //   return this.#map.map((tile) => tile.save())
  // }

  width() {
    return this.#width;
  }
}

export default World;