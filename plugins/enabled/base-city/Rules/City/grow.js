import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:grow:empty-food-storage',
  new Effect((city) => city.foodStorage = 0)
));

RulesRegistry.register(new Rule(
  'city:grow:assign-workers',
  new Effect((city) =>   city.assignUnassignedWorkers())
));
