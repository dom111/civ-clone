import {Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme} from '../Units.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [Settlers, 40],
  [Militia, 10],
  [Cavalry, 20],
  [Catapult, 40],
  [Spearman, 20],
  [Swordman, 20],
  [Trireme, 40],
]
  .forEach(([Unit, cost]) => {
    RulesRegistry.register(new Rule(
      `city:build-cost:${Unit.name.toLowerCase()}`,
      new Criterion((CheckUnit) => CheckUnit === Unit),
      new Effect(() => cost)
    ));
  })
;
