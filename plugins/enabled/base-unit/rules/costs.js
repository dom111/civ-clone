import {Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme} from '../Units.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:build-cost:settlers',
  new Criterion((constructor) => constructor === Settlers),
  new Effect(() => 40)
));
RulesRegistry.register(new Rule(
  'city:build-cost:militia',
  new Criterion((constructor) => constructor === Militia),
  new Effect(() => 10)
));
RulesRegistry.register(new Rule(
  'city:build-cost:cavalry',
  new Criterion((constructor) => constructor === Cavalry),
  new Effect(() => 20)
));
RulesRegistry.register(new Rule(
  'city:build-cost:catapult',
  new Criterion((constructor) => constructor === Catapult),
  new Effect(() => 40)
));
RulesRegistry.register(new Rule(
  'city:build-cost:spearman',
  new Criterion((constructor) => constructor === Spearman),
  new Effect(() => 20)
));
RulesRegistry.register(new Rule(
  'city:build-cost:swordman',
  new Criterion((constructor) => constructor === Swordman),
  new Effect(() => 20)
));
RulesRegistry.register(new Rule(
  'city:build-cost:trireme',
  new Criterion((constructor) => constructor === Trireme),
  new Effect(() => 40)
));