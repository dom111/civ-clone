import {Food} from '../base-terrain-yields/Yields.js';

export class CityGrowth {
  #city;
  #cost = new Food(20);
  #progress = new Food();

  constructor(city) {
    this.#city = city;
  }

  add(food) {
    if (! (food instanceof Food)) {
      throw new TypeError(`CityGrowth#add: Cannot add '${food.constructor ? food.constructor.name : typeof food}' to progress.`);
    }

    this.#progress.add(food);
  }

  check() {
    if (this.#progress.value() < 0) {
      this.city.shrink();

      return;
    }

    if (this.#progress.value() >= this.#cost) {
      this.city.grow();
    }
  }

  get city() {
    return this.#city;
  }

  get cost() {
    return this.#cost;
  }

  empty() {
    this.#progress.subtract(this.#progress.value());
  }

  get progress() {
    return this.#progress;
  }

  remaining() {
    return this.#cost - this.#progress.value();
  }
}

export default CityGrowth;
