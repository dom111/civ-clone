import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Action {
  #from;
  #rulesRegistry;
  #to;
  #unit;

  constructor({
    from,
    rulesRegistry = RulesRegistry.getInstance(),
    to,
    unit,
  }) {
    this.#from = from;
    this.#rulesRegistry = rulesRegistry;
    this.#to = to;
    this.#unit = unit;
  }

  forUnit(unit) {
    return new (this.constructor)({
      from: this.#from,
      rulesRegistry: this.#rulesRegistry,
      to: this.#to,
      unit,
    });
  }

  get from() {
    return this.#from;
  }

  get rulesRegistry() {
    return this.#rulesRegistry;
  }

  get to() {
    return this.#to;
  }

  get unit() {
    return this.#unit;
  }
}

export default Action;
