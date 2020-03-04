import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:grow:empty-food-storage',
  new Effect((city) => CityGrowthRegistry.getBy('city', city)
    .forEach((cityGrowth) => cityGrowth.empty())
  )
));

RulesRegistry.register(new Rule(
  'city:grow:set-growth-cost',
  new Effect((city) => CityGrowthRegistry.getBy('city', city)
    .forEach((cityGrowth) => cityGrowth.cost.add(10))
  )
));

RulesRegistry.register(new Rule(
  'city:grow:assign-workers',
  new Effect((city) => city.assignUnassignedWorkers())
));
