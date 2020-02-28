import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:shrink:empty-food-storage',
  new Effect((city) => city.foodStorage = 0)
));

RulesRegistry.register(new Rule(
  'city:shrink:check-valid',
  new Criterion((city) => city.size === 0),
  new Effect((city) => city.destroy())
));

