import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Granary} from '../../Improvements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:grow:granary',
  new Criterion((city) => city.improvements.some((improvement) => improvement instanceof Granary)),
  new Effect((city) => city.foodStorage = 5 + (city.size * 5))
));
