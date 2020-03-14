import RulesRegistry from '../core-rules/RulesRegistry.js';

export class CityImprovement {
  #city;
  #rulesRegistry;
  #player;

  constructor({city, player = city.player, rulesRegistry = RulesRegistry.getInstance()}) {
    this.#city   = city;
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('city:improvement:created', this, city);
  }

  get city() {
    return this.#city;
  }

  get player() {
    return this.#player;
  }
}

export default CityImprovement;
