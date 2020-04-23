export class Criterion {
  /** @type {function} */
  #criterion;

  /**
   * @param criterion {function}
   */
  constructor(criterion) {
    if (criterion) {
      if (typeof criterion !== 'function') {
        throw TypeError(`Criterion: 'criterion' must be a function, got '${criterion ? criterion.constructor.name : criterion}'.`);
      }

      this.#criterion = criterion;
    }
  }

  /**
   * @returns {boolean}
   */
  validate(...args) {
    if (this.#criterion) {
      return !! this.#criterion(...args);
    }

    return true;
  }
}

export default Criterion;
