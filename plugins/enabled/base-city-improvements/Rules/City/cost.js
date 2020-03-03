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
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Unhappiness} from '../../../base-city-happiness/Yields/Unhappiness.js';

[
  [Aqueduct, 2, Gold],
  [CityWalls, 2, Gold],
  [Colosseum, 2, Gold],
  [Courthouse, 1, Gold],
  [Granary, 1, Gold],
  [Library, 1, Gold],
  [Marketplace, 1, Gold],
  [Temple, 1, Gold],
]
  .forEach(([Improvement, value, Yield]) => RulesRegistry.register(new Rule(
    `city:cost:${[Improvement, Yield].map((Entity) => Entity.name).join(':')}`,
    new Criterion((tileYield) => tileYield instanceof Yield),
    new Criterion((tileYield, city) => CityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof Improvement)
    ),
    new Effect((tileYield) => tileYield.subtract(value))
  )))
;

[
  [Temple, 1, Unhappiness],
  [Colosseum, 2, Unhappiness],
]
  .forEach(([Improvement, value, Yield]) => RulesRegistry.register(new Rule(
    `city:cost:${[Improvement, Yield].map((Entity) => Entity.name).join(':')}`,
    new Criterion((tileYield) => tileYield instanceof Yield),
    new Criterion((tileYield, city) => CityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof Improvement)
    ),
    new Effect((tileYield) => tileYield.subtract(value))
  )))
;

[
  [Temple, 1, Unhappiness, Mysticism],
]
  .forEach(([Improvement, value, Yield, Advance]) => RulesRegistry.register(new Rule(
    `city:cost:${[Improvement, Yield, Advance].map((Entity) => Entity.name).join(':')}`,
    new Criterion((tileYield) => tileYield instanceof Yield),
    new Criterion((tileYield, city) => CityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof Improvement)
    ),
    new Criterion((tileYield, city) => PlayerResearchRegistry.getBy('player', city.player)
      .some((playerResearch) => playerResearch.completed(Advance))
    ),
    new Effect((tileYield) => tileYield.subtract(Math.min(value, tileYield.value())))
  )))
;
