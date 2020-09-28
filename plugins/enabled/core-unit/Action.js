import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class Action {
  /** @type {Tile} */
  #from;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {Tile} */
  #to;
  /** @type {Unit} */
  #unit;

  /**
   * @param from {Tile}
   * @param rulesRegistry {RulesRegistry}
   * @param to {Tile}
   * @param unit {Unit}
   */
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

  /**
   * @param unit {Unit}
   * @returns {Action}
   */
  forUnit(unit) {
    return new (this.constructor)({
      from: this.#from,
      rulesRegistry: this.#rulesRegistry,
      to: this.#to,
      unit,
    });
  }

  /**
   * @returns {Tile}
   */
  from() {
    return this.#from;
  }

  perform() {}

  /**
   * @returns {RulesRegistry}
   */
  rulesRegistry() {
    return this.#rulesRegistry;
  }

  /**
   * @returns {Tile}
   */
  to() {
    return this.#to;
  }

  /**
   * @returns {Unit}
   */
  unit() {
    return this.#unit;
  }
}

export default Action;
