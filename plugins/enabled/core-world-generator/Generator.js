export class Generator {
  /** @type {number} */
  #height;
  /** @type {number} */
  #width;

  /**
   * @param height   *

   * @param width {number}
   */
  constructor({height, width} = {}) {
    this.#height = height;
    this.#width = width;
  }

  /**
   * @param x {number}
   * @param y {number}
   * @returns {number}
   */
  coordsToIndex(x, y) {
    while (x < 0) {
      x += this.width();
    }

    while (y < 0) {
      y += this.height();
    }

    x = x % this.width();
    y = y % this.height();

    return (y * this.width()) + x;
  }

  /**
   * @abstract
   * @return {Terrain[]}
   */
  generate() {
    throw new Error(`Generator#generate(): Must be overridden in '${this.constructor.name}'.`);
  }

  /**
   * @returns {number}
   */
  height() {
    return this.#height;
  }

  /**
   * @returns {[number, number]}
   */
  indexToCoords(index) {
    const total = this.height() * this.width();

    while (index < 0) {
      index += total;
    }

    index = index % total;

    return [index % this.width(), Math.floor(index / this.width())];
  }

  /**
   * @param from {number}
   * @param to {number}
   * @returns {number}
   */
  distanceFrom(from, to) {
    const [fromX, fromY] = this.indexToCoords(from),
      [toX, toY] = this.indexToCoords(to),
      [shortestDistance] = [
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, 1],
        [0, 0],
        [0, -1],
        [1, 1],
        [1, 0],
        [1, -1],
      ]
        .map(([x, y]) => [x * this.width(), y * this.height()])
        .map(([x, y]) => [(fromX - toX) + x, (fromY - toY) + y])
        .map((coords) => Math.hypot(...coords))
        .sort((a, b) => a - b)
    ;

    return shortestDistance;
  }

  /**
   * @returns {number}
   */
  width() {
    return this.#width;
  }
}

export default Generator;
