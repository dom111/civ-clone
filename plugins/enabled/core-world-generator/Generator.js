export class Generator {
  #height;
  #width;

  constructor({height, width} = {}) {
    this.#height = height;
    this.#width = width;
  }

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

  generate() {
    throw new Error(`Generator#generate(): Must be overridden in '${this.constructor.name}'.`);
  }

  height() {
    return this.#height;
  }

  indexToCoords(index) {
    const total = this.height() * this.width();

    while (index < 0) {
      index += total;
    }

    index = index % total;

    return [index % this.width(), Math.floor(index / this.width())];
  }

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

  width() {
    return this.#width;
  }
}

export default Generator;
