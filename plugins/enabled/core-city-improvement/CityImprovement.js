import RulesRegistry from '../core-rules/RulesRegistry.js';

export class CityImprovement {
  #city;
  #player;

  constructor({player, city}) {
    this.#player = player;
    this.#city   = city;

    RulesRegistry.get('city:improvement:created')
      .filter((rule) => rule.validate(this, city))
      .forEach((rule) => rule.process(this, city))
    ;
  }

  get city() {
    return this.#city;
  }

  get player() {
    return this.#player;
  }
}

export default CityImprovement;
