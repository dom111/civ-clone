import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

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

  from() {
    return this.#from;
  }

  rulesRegistry() {
    return this.#rulesRegistry;
  }

  to() {
    return this.#to;
  }

  unit() {
    return this.#unit;
  }
}

export default Action;
