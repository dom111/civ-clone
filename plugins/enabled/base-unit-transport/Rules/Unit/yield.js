import {Attack, Defence, Movement, Visibility} from '../../../core-unit/Yields.js';
import {
  Sail,
  Trireme,
} from '../../Units.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Sail, 1, 1, 3],
    [Trireme, 1, 0, 3],
  ]
    .flatMap(([Unit, attack = 1, defence = 1, movement = 1, visibility = 1]) => [
      [Attack, attack],
      [Defence, defence],
      [Movement, movement],
      [Visibility, visibility],
    ]
      .map(([Yield, value]) => new Rule(
        `unit:yield:${[Yield, Unit].map((entity) => entity.name.toLowerCase()).join(':')}`,
        new Criterion((unit) => unit instanceof Unit || unit === Unit),
        new Criterion((unit, unitYield) => unitYield instanceof Yield),
        new Effect((unit, unitYield) => unitYield.add(value))
      ))
    )
  ,
];

export default getRules;
