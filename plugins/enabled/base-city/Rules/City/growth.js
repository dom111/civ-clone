import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:growth:positive',
  // TODO: make this a Yield
  new Criterion((city) => city.foodStorage >= ((city.size * 10) + 10)),
  new Effect((city) => city.grow())
));

RulesRegistry.register(new Rule(
  'city:growth:negative',
  new Criterion((city) => city.foodStorage < 0),
  new Effect((city) => city.shrink())
));
