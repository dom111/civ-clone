import Criterion from './Criterion.js';

export class Criteria extends Criterion {
  /**
   * @returns {Criterion[]}
   */
  #criteria = [];

  /**
   * @param criteria {Criterion}
   */
  constructor(...criteria) {
    super();

    criteria.forEach((criterion) => {
      if (! (criterion instanceof Criterion)) {
        throw new TypeError(`Rule: all criteria must be instances of Criterion, got '${criterion ? criterion.constructor.name : criterion}'.`);
      }

      this.#criteria.push(criterion);
    });
  }

  /**
   * @returns {Criterion[]}
   */
  criteria() {
    return this.#criteria;
  }

  /**
   * @returns {boolean}
   */
  validate(...args) {
    return this.#criteria.every((criterion) => !! criterion.validate(...args));
  }
}

export default Criteria;
