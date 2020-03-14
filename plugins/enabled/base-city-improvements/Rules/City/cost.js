import {
  Aqueduct,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Temple,
} from '../../CityImprovements.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gold} from '../../../base-currency/Yields.js';
import {Mysticism} from '../../../base-science/Advances.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import {Unhappiness} from '../../../base-city-happiness/Yields/Unhappiness.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [Aqueduct, 2, Gold],
    [CityWalls, 2, Gold],
    [Colosseum, 2, Gold],
    [Courthouse, 1, Gold],
    [Granary, 1, Gold],
    [Library, 1, Gold],
    [Marketplace, 1, Gold],
    [Temple, 1, Gold],
  ]
    .map(([Improvement, value, Yield]) => new Rule(
      `city:cost:${[Improvement, Yield].map((Entity) => Entity.name).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, city) => cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Effect((tileYield) => tileYield.subtract(value))
    )),

  ...[
    [Temple, 1, Unhappiness],
    [Colosseum, 2, Unhappiness],
  ]
    .map(([Improvement, value, Yield]) => new Rule(
      `city:cost:${[Improvement, Yield].map((Entity) => Entity.name).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, city) => cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Effect((tileYield) => tileYield.subtract(value))
    )),

  ...[
    [Temple, 1, Unhappiness, Mysticism],
  ]
    .map(([Improvement, value, Yield, Advance]) => new Rule(
      `city:cost:${[Improvement, Yield, Advance].map((Entity) => Entity.name).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, city) => cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Criterion((tileYield, city) => playerResearchRegistry.getBy('player', city.player)
        .some((playerResearch) => playerResearch.completed(Advance))
      ),
      new Effect((tileYield) => tileYield.subtract(Math.min(value, tileYield.value())))
    )),
];

export default getRules;
