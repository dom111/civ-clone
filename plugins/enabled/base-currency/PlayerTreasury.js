import CityBuildRegistry from '../base-city/CityBuildRegistry.js';
import {Gold} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Yield from '../core-yields/Yield.js';

export class PlayerTreasury extends Yield {
  #player;

  constructor(player) {
    super();

    this.#player = player;
  }

  buy(city) {
    const [cityBuild] = CityBuildRegistry.getBy('city', city),
      cost = this.cost(city)
    ;

    if (city.player !== this.#player) {
      return;
    }

    if (this.value() < cost.value()) {
      return;
    }

    cityBuild.add(new Production(cityBuild.remaining()));

    this.subtract(cost.value());
  }

  cost(city) {
    const [cityBuild] = CityBuildRegistry.getBy('city', city),
      cost = new Gold()
    ;

    RulesRegistry.get('city:spend')
      .filter((rule) => rule.validate(cityBuild, cost))
      .forEach((rule) => rule.process(cityBuild, cost))
    ;

    return cost;
  }

  get player() {
    return this.#player;
  }
}

export default PlayerTreasury;