import Generator from '../core-world-generator/Generator.js';
import {Land} from '../core-terrain/Types.js';

export class FillGenerator extends Generator {
  #Terrain;
  #height;
  #width;

  constructor({
    height,
    width,
    Terrain = Land,
  }) {
    super({height, width});

    this.#height = height;
    this.#width = width;
    this.#Terrain = Terrain;
  }

  generate() {
    return new Array(this.#height * this.#width)
      .fill(0)
      .map(() => new (this.#Terrain)())
    ;
  }
}

export default FillGenerator;
