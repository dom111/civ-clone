import Criterion from './Criterion.js';

export class Criteria {
  #criteria = [];

  constructor(...criteria) {
    criteria.forEach((criterion) => {
      if (typeof criterion === 'function') {
        criterion = new Criterion(criterion);
      }

      else if (! (criterion instanceof Criteria) && ! (criterion instanceof Criterion)) {
        throw new TypeError(`Rule: all criteria must be instances of Criteria or Criterion, got '${typeof apply}'.`);
      }

      this.#criteria.push(criterion);
    });
  }

  criteria() {
    return this.#criteria;
  }

  validate(...args) {
    return this.#criteria.every((criterion) => !! criterion.validate(...args));
  }
}

export default Criteria;