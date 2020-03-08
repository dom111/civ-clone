export class PathFinder {
  #end;
  #start;
  #unit;

  constructor(unit, start, end) {
    this.#end = end;
    this.#start = start;
    this.#unit = unit;
  }

  get end() {
    return this.#end;
  }

  generate() {
    throw new Error(`PathFinder#generate: Must be overridden in '${this.constructor.name}'.`);
  }

  get start() {
    return this.#start;
  }

  get unit() {
    return this.#unit;
  }
}

export default PathFinder;
