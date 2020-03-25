import And from './Criteria/And.js';
import Criteria from './Criteria.js';
import Criterion from './Criterion.js';
import Effect from './Effect.js';
import {Normal} from './Priorities.js';
import Priority from './Priority.js';

export class Rule {
  #criteria;
  #effect;
  #name;
  #priority = new Normal();

  constructor(name, ...values) {
    const criteria = [];

    values.forEach((value) => {
      if (value instanceof Effect) {
        if (this.#effect) {
          throw new TypeError('Rule: effect already specified, but another was provided.');
        }

        this.#effect = value;

        return;
      }

      if (value instanceof Criteria || value instanceof Criterion) {
        criteria.push(value);

        return;
      }

      if (value instanceof Priority) {
        this.#priority = value;

        return;
      }

      throw new TypeError(`Unknown value passed to Rule#constructor: ${value ? value.constructor.name : value}.`);
    });

    this.#criteria = new And(...criteria);
    this.#name = name;
  }

  hasEffect() {
    return this.#effect;
  }

  name() {
    return this.#name;
  }

  priority() {
    return this.#priority;
  }

  process(...args) {
    if (this.hasEffect()) {
      return this.#effect.apply(...args);
    }
  }

  validate(...args) {
    if (this.#criteria instanceof And) {
      return this.#criteria.validate(...args);
    }
  }
}

export default Rule;