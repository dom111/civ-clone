import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:shrink:empty-food-storage',
  new Effect((city) => CityGrowthRegistry.getBy('city', city)
    .forEach((cityGrowth) => cityGrowth.empty()))
));

RulesRegistry.register(new Rule(
  'city:shrink:set-growth-cost',
  new Effect((city) => CityGrowthRegistry.getBy('city', city)
    .forEach((cityGrowth) => cityGrowth.cost.subtract(10))
  )
));

RulesRegistry.register(new Rule(
  'city:shrink:check-valid',
  new Criterion((city) => city.size === 0),
  new Effect((city) => city.destroy())
));

