export class PathFinder {
  #end;
  #start;
  #unit;

  constructor(unit, start, end) {
    this.#end = end;
    this.#start = start;
    this.#unit = unit;
  }

  end() {
    return this.#end;
  }

  generate() {
    throw new Error(`PathFinder#generate: Must be overridden in '${this.constructor.name}'.`);
  }

  start() {
    return this.#start;
  }

  unit() {
    return this.#unit;
  }
}

export default PathFinder;
