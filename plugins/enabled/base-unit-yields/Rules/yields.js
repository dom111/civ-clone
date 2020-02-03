import {Attack, Defence, Movement, Visibility} from '../../core-unit-yields/Yields.js';
import {Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme} from '../../base-unit/Units.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [Catapult, 4],
  [Cavalry, 2, 1, 2],
  [Militia],
  [Settlers, 0],
  [Spearman, 1, 2],
  [Swordman, 3],
  [Trireme, 1, 1, 3],
]
  .forEach(([Unit, attack = 1, defence = 1, movement = 1, visibility = 1]) => {
    [
      [Attack, attack],
      [Defence, defence],
      [Movement, movement],
      [Visibility, visibility],
    ]
      .forEach(([Yield, value]) => RulesRegistry.register(new Rule(
        `unit:yield:${[Yield, Unit].map((entity) => entity.name.toLowerCase()).join(':')}`,
        new Criterion((unit) => unit instanceof Unit),
        new Criterion((unit, unitYield) => unitYield instanceof Yield),
        new Effect((unit, unitYield) => unitYield.add(value))
      )))
    ;
  })
;
