import And from './Criteria/And.js';
import Criterion from './Criterion.js';
import Effect from './Effect.js';
import {Normal} from './Priorities.js';
import Priority from './Priority.js';

export class Rule {
  /** @type {Criterion} */
  #criteria;
  /** @type {Effect} */
  #effect;
  /** @type {string} */
  #name;
  /** @type {Priority} */
  #priority = new Normal();

  /**
   * @param name {string}
   * @param values {...(Priority|Criterion|Effect)}
   */
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

      if (value instanceof Criterion) {
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

  /**
   * @returns {Effect}
   */
  hasEffect() {
    return this.#effect;
  }

  /**
   * @returns {string}
   */
  name() {
    return this.#name;
  }

  /**
   * @returns {Priority}
   */
  priority() {
    return this.#priority;
  }

  process(...args) {
    if (this.hasEffect()) {
      return this.#effect.apply(...args);
    }
  }

  /**
   * @returns {boolean}
   */
  validate(...args) {
    if (this.#criteria instanceof And) {
      return this.#criteria.validate(...args);
    }
  }
}

export default Rule;
