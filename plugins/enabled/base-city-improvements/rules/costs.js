import {Barracks, CityWalls, Granary} from '../Improvements.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:build-cost:barracks',
  new Criterion((constructor) => constructor === Barracks),
  new Effect(() => 40)
));
RulesRegistry.register(new Rule(
  'city:build-cost:citywalls',
  new Criterion((constructor) => constructor === CityWalls),
  new Effect(() => 120)
));
RulesRegistry.register(new Rule(
  'city:build-cost:granary',
  new Criterion((constructor) => constructor === Granary),
  new Effect(() => 60)
));
