import {
  Sail,
  Trireme,
} from '../../Units.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Sail, 40],
    [Trireme, 40],
  ]
    .map(([Unit, cost]) => new Rule(
      `city:build-cost:${Unit.name.toLowerCase()}`,
      new Criterion((CheckUnit) => CheckUnit === Unit),
      new Effect(() => cost)
    )),
];

export default getRules;
