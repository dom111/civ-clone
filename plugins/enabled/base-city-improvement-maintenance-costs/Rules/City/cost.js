import {
  Aqueduct,
  CityWalls,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Temple,
} from '../../../base-city-improvements/Improvements.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gold} from '../../../base-currency/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Aqueduct, 2, Gold],
  [CityWalls, 2, Gold],
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
