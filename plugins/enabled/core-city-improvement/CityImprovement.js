import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class CityImprovement {
  /** @type {City} */
  #city;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {Player} */
  #player;

  /**
   * @param city {City}
   * @param player {Player}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({city, player = city.player(), rulesRegistry = RulesRegistry.getInstance()}) {
    this.#city   = city;
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('city:improvement:created', this, city);
  }

  /**
   * @returns {City}
   */
  city() {
    return this.#city;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }
}

export default CityImprovement;
