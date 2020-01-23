export class Criterion {
  #criterion;

  constructor(criterion) {
    if (criterion) {
      if (typeof criterion !== 'function') {
        throw TypeError(`Criterion: 'criterion' must be a function, got '${typeof criterion}'.`);
      }

      this.#criterion = criterion;
    }
  }

  validate(...args) {
    if (this.#criterion) {
      return !! this.#criterion(...args);
    }

    return true;
  }
}

export default Criterion;