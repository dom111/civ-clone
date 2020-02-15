import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:cost:food:base',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Effect((tileYield, city) => tileYield.subtract(city.size * 2))
));
