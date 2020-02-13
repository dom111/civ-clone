import {Aqueduct, Barracks, CityWalls, Courthouse, Granary, Library, Palace, Temple} from '../../Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Aqueduct, 120],
  [Barracks, 40],
  [CityWalls, 120],
  [Courthouse, 80],
  [Granary, 60],
  [Library, 80],
  [Palace, 200],
  [Temple, 40],
]
  .forEach(([Improvement, cost]) => {
    RulesRegistry.register(new Rule(
      `city:build-cost:${Improvement.name.toLowerCase()}`,
      new Criterion((constructor) => constructor === Improvement),
      new Effect(() => cost)
    ));
  })
;
