import {
  Catapult,
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Settlers,
  Spearman,
  Swordman,
} from '../../Units.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Catapult, 40],
    [Cavalry, 20],
    [Chariot, 40],
    [Knights, 40],
    [Militia, 10],
    [Musketman, 30],
    [Settlers, 40],
    [Spearman, 20],
    [Swordman, 20],
  ]
    .map(([Unit, cost]) => new Rule(
      `city:build-cost:${Unit.name.toLowerCase()}`,
      new Criterion((CheckUnit) => CheckUnit === Unit),
      new Effect(() => cost)
    )),
];

export default getRules;
