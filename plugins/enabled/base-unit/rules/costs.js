import {Catapult, Cavalry, Militia, Settlers, Trireme} from '../Units.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'city:build-cost:settlers',
  new Criterion((constructor) => constructor === Settlers),
  new Effect(() => 40)
));
Rules.register(new Rule(
  'city:build-cost:militia',
  new Criterion((constructor) => constructor === Militia),
  new Effect(() => 10)
));
Rules.register(new Rule(
  'city:build-cost:cavalry',
  new Criterion((constructor) => constructor === Cavalry),
  new Effect(() => 20)
));
Rules.register(new Rule(
  'city:build-cost:catapult',
  new Criterion((constructor) => constructor === Catapult),
  new Effect(() => 40)
));
Rules.register(new Rule(
  'city:build-cost:trireme',
  new Criterion((constructor) => constructor === Trireme),
  new Effect(() => 40)
));