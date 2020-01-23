import Tile from './Tile.js';

export class World {
  #generator;
  #height;
  #map;
  #width;

  constructor(generator) {
    this.#generator = generator;
    this.#height = generator.height;
    this.#width = generator.width;

    // TODO: use this to help generate consistent maps
    this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = 615489;
  }

  build(options) {
    const rawMap = this.#generator.generate(options);

    this.#map = rawMap
      .map((terrain, i) => new Tile({
        x: i % this.#width,
        y: Math.floor(i / this.#width),
        terrain,
        map: this,
      }))
    ;
  }

  get(x, y) {
    return this.#map[this.#generator.coordsToIndex(x, y)];
  }

  getBy(filterFunction) {
    return this.#map.filter(filterFunction);
  }

  get height() {
    return this.#height;
  }

  load() {
    // TODO
  }

  get width() {
    return this.#width;
  }
}

export default World;