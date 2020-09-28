export class PathFinder {
  /** @type {Tile} */
  #end;
  /** @type {Tile} */
  #start;
  /** @type {Unit} */
  #unit;

  /**
   * @param unit {Unit}
   * @param start {Tile}
   * @param end {Tile}
   */
  constructor(unit, start, end) {
    this.#end = end;
    this.#start = start;
    this.#unit = unit;
  }

  /**
   * @returns {Tile}
   */
  end() {
    return this.#end;
  }

  /**
   * @abstract
   */
  generate() {
    throw new Error(`PathFinder#generate: Must be overridden in '${this.constructor.name}'.`);
  }

  /**
   * @returns {Tile}
   */
  start() {
    return this.#start;
  }

  /**
   * @returns {Unit}
   */
  unit() {
    return this.#unit;
  }
}

export default PathFinder;
