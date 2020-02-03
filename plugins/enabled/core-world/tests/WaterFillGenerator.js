import Generator from '../../core-world-generator/Generator.js';
import {Water} from '../../core-terrain/Types.js';

export class WaterFillGenerator extends Generator {
  #height;
  #width;

  constructor({
    height,
    width,
  }) {
    super({height, width});

    this.#height = height;
    this.#width = width;
  }

  generate() {
    return new Array(this.#height * this.#width)
      .fill(0)
      .map(() => new Water())
    ;
  }
}

export default WaterFillGenerator;
