import {Catapult, Cavalry, Militia, Settlers} from './Units.js';
import Criterion from '../core-rules/Criterion.js';
import Effect from '../core-rules/Effect.js';
import Rule from '../core-rules/Rule.js';

new Rule(
  'unit:build-cost:settlers',
  new Criterion((constructor) => constructor === Settlers),
  new Effect(() => 40)
);
new Rule(
  'unit:build-cost:militia',
  new Criterion((constructor) => constructor === Militia),
  new Effect(() => 10)
);
new Rule(
  'unit:build-cost:cavalry',
  new Criterion((constructor) => constructor === Cavalry),
  new Effect(() => 20)
);
new Rule(
  'unit:build-cost:catapult',
  new Criterion((constructor) => constructor === Catapult),
  new Effect(() => 40)
);