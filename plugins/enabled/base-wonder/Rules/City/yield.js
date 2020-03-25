import {Colossus, CopernicusObservatory, HangingGardens, Oracle} from '../../Wonders.js';
import {Happiness, Unhappiness} from '../../../base-city-happiness/Yields.js';
import {High, Low} from '../../../core-rules/Priorities.js';
import {Invention, Mysticism} from '../../../base-science/Advances.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
// import {Automobile, Electricity, Invention, Mysticism, Religion} from '../../../base-science/Advances.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import {Research} from '../../../base-science/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import {Temple} from '../../../base-city-improvements/CityImprovements.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:trade:colossus',
    new High(),
    new Criterion((cityYield) => cityYield instanceof Trade),
    new Criterion((cityYield, city) => wonderRegistry.getBy('city', city)
      .some((wonder) => wonder instanceof Colossus)
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Electricity))
    // ),
    new Effect((cityYield, city) => cityYield.add(city.tilesWorked()
      .filter((tile) => tile.yields({
        yields: [Trade],
      })
        .every((tileYield) => tileYield.value() > 0)
      )
      .length
    ))
  ),
  new Rule(
    'city:yield:science:copernicus-observatory',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Research),
    new Criterion((cityYield, city) => wonderRegistry.getBy('city', city)
      .some((wonder) => wonder instanceof CopernicusObservatory)
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Automobile))
    // ),
    new Effect((cityYield) => cityYield.add(cityYield))
  ),
  new Rule(
    'city:yield:happiness:hanging-gardens',
    new Criterion((cityYield) => cityYield instanceof Happiness),
    new Criterion((cityYield, city) => wonderRegistry.filter((wonder) => wonder instanceof HangingGardens)
      .some((wonder) => wonder.city().player() === city.player())
    ),
    new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
      .some((playerResearch) => ! playerResearch.completed(Invention))
    ),
    new Effect((cityYield) => cityYield.add(1))
  ),
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
