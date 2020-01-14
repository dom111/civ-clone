import Criteria from './Criteria.js';
import Criterion from './Criterion.js';
import Effect from './Effect.js';

export class Rule {
  static #rules = [];

  #criteria;
  #effect;
  #name;

  constructor(name, ...values) {
    const criteria = [];

    values.forEach((value) => {
      if (value instanceof Effect) {
        if (this.#effect) {
          throw new TypeError('Rule: effect already specified, but another was provided.');
        }

        return this.#effect = value;
      }

      if (value instanceof Criteria || value instanceof Criterion) {
        return criteria.push(value);
      }

      throw new TypeError(`Unknown value passed to Rule#constructor: ${Object.prototype.toString.call(value)}.`);
    });

    this.#criteria = new Criteria(...criteria);
    this.#name = name;

    Rule.#rules.push(this);
  }

  get hasEffect() {
    return this.#effect;
  }

  get name() {
    return this.#name;
  }

  process(...args) {
    if (this.hasEffect) {
      return this.#effect.apply(...args);
    }
  }

  unregister() {
    Rule.#rules.splice(Rule.#rules.indexOf(this), 1);
  }

  validate(...args) {
    if (this.#criteria instanceof Criteria) {
      return this.#criteria.validate(...args);
    }
  }

  static get(ruleName) {
    return this.#rules.filter((rule) => rule.name.startsWith(`${ruleName}:`));
  }

  static unregister(ruleName) {
    [
      ...this.filter((rule) => rule.name === ruleName),
      ...this.get(ruleName),
    ].forEach((rule) => rule.unregister());
  }
}

export default Rule;