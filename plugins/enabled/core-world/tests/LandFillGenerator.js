import Generator from '../../core-world-generator/Generator.js';
import {Land} from '../../core-terrain/Types.js';

export class LandFillGenerator extends Generator {
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
      .map(() => new Land())
    ;
  }
}

export default LandFillGenerator;
