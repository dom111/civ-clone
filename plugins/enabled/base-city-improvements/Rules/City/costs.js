import {Barracks, CityWalls, Granary} from '../../Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Barracks, 40],
  [CityWalls, 120],
  [Granary, 60],
]
  .forEach(([Improvement, cost]) => {
    RulesRegistry.register(new Rule(
      `city:build-cost:${Improvement.name.toLowerCase()}`,
      new Criterion((constructor) => constructor === Improvement),
      new Effect(() => cost)
    ));
  })
;