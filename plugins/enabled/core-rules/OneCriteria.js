import Criteria from './Criteria.js';

export class AllCriteria extends Criteria {
  validate(...args) {
    return this.criteria.some((criterion) => !! criterion.validate(...args));
  }
}

export default AllCriteria;