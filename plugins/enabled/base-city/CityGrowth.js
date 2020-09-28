import {Food} from '../base-terrain-yields/Yields.js';

export class CityGrowth {
  /** @type {City} */
  #city;
  /** @type {Food} */
  #cost = new Food(20);
  /** @type {Food} */
  #progress = new Food();

  /**
   * @param city {City}
   */
  constructor(city) {
    this.#city = city;
  }

  /**
   * @param food {Food}
   */
  add(food) {
    if (! (food instanceof Food)) {
      throw new TypeError(`CityGrowth#add: Cannot add '${food.constructor ? food.constructor.name : typeof food}' to progress.`);
    }

    this.#progress.add(food);
  }

  check() {
    if (this.#progress.value() < 0) {
      this.city().shrink();

      return;
    }

    if (this.#progress.value() >= this.#cost) {
      this.city().grow();
    }
  }

  /**
   * @returns {City}
   */
  city() {
    return this.#city;
  }

  /**
   * @returns {Food}
   */
  cost() {
    return this.#cost;
  }

  empty() {
    this.#progress.subtract(this.#progress.value());
  }

  /**
   * @returns {Food}
   */
  progress() {
    return this.#progress;
  }

  /**
   * @returns {number}
   */
  remaining() {
    return this.#cost - this.#progress.value();
  }
}

export default CityGrowth;
