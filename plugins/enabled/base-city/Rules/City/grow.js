import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:grow:empty-food-storage',
    new Effect((city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => cityGrowth.empty())
    )
  ),
  new Rule(
    'city:grow:set-growth-cost',
    new Effect((city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => cityGrowth.cost().add(10))
    )
  ),
  new Rule(
    'city:grow:assign-workers',
    new Effect((city) => city.assignUnassignedWorkers())
  ),
];

export default getRules;
