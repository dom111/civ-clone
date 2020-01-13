import Rule from '../core-rules/Rule.js';
import {Granary} from './Improvements.js';
import Effect from '../core-rules/Effect.js';
import Criterion from '../core-rules/Criterion.js';

Rule.register(new Rule(
  'city:grow:granary',
  new Criterion((city) => city.improvements.filter((improvement) => improvement instanceof Granary)),
  new Effect((city) => city.foodStorage = 5 + (city.size * 5))
));
