import Criteria from '../Criteria.js';

export class Or extends Criteria {
  validate(...args) {
    return (! this.criteria().length) || this.criteria().some((criterion) => !! criterion.validate(...args));
  }
}

export default Or;
