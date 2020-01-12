export class Criterion {
  #criterion;

  constructor(criterion) {
    if (typeof criterion !== 'function') {
      throw TypeError(`Criterion: 'criterion' must be a function, got '${typeof criterion}'.`);
    }

    this.#criterion = criterion;
  }

  validate(...args) {
    return !! this.#criterion(...args);
  }
}

export default Criterion;