import CityBuildRegistry from '../base-city/CityBuildRegistry.js';
import {Gold} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Yield from '../core-yields/Yield.js';

export class PlayerTreasury extends Yield {
  #player;
  #rulesRegistry;
  #cityBuildRegistry;

  constructor({
    player,
    rulesRegistry = RulesRegistry.getInstance(),
    cityBuildRegistry = CityBuildRegistry.getInstance(),
  }) {
    super();

    this.#player = player;
    this.#rulesRegistry = rulesRegistry;
    this.#cityBuildRegistry = cityBuildRegistry;
  }

  buy(city) {
    const [cityBuild] = this.#cityBuildRegistry.getBy('city', city),
      cost = this.cost(city)
    ;

    if (city.player() !== this.#player) {
      return;
    }

    if (this.value() < cost.value()) {
      return;
    }

    cityBuild.add(new Production(cityBuild.remaining()));

    this.subtract(cost.value());
  }

  cost(city) {
    const [cityBuild] = this.#cityBuildRegistry.getBy('city', city),
      cost = new Gold()
    ;

    this.#rulesRegistry.process('city:spend', cityBuild, cost);

    return cost;
  }

  player() {
    return this.#player;
  }
}

export default PlayerTreasury;
