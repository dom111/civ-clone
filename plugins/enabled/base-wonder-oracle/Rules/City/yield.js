// import {Mysticism, Religion} from '../../../base-science/Advances.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Low} from '../../../core-rules/Priorities.js';
import {Mysticism} from '../../../base-science/Advances.js';
import Oracle from '../../Oracle.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import {Temple} from '../../../base-city-improvements-civ1/CityImprovements.js';
import {Unhappiness} from '../../../base-city-happiness/Yields.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:unhappiness:oracle',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Unhappiness),
    new Criterion((cityYield, city) => wonderRegistry.filter((wonder) => wonder instanceof Oracle)
      .some((wonder) => wonder.city().player() === city.player())
    ),
    new Criterion((cityYield, city) => cityImprovementRegistry.getBy('city', city)
      .some((cityImprovement) => cityImprovement instanceof Temple)
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Religion))
    // ),
    new Effect((cityYield) => cityYield.subtract(Math.min(1, cityYield.value())))
  ),
  new Rule(
    'city:yield:unhappiness:oracle:mysticism',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Unhappiness),
    new Criterion((cityYield, city) => wonderRegistry.filter((wonder) => wonder instanceof Oracle)
      .some((wonder) => wonder.city().player() === city.player())
    ),
    new Criterion((cityYield, city) => cityImprovementRegistry.getBy('city', city)
      .some((cityImprovement) => cityImprovement instanceof Temple)
    ),
    new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
      .some((playerResearch) => playerResearch.completed(Mysticism))
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Religion))
    // ),
    new Effect((cityYield) => cityYield.subtract(Math.min(1, cityYield.value())))
  ),
];

export default getRules;
