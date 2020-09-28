import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:shrink:empty-food-storage',
    new Effect((city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => cityGrowth.empty()))
  ),
  new Rule(
    'city:shrink:set-growth-cost',
    new Effect((city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => cityGrowth.cost().subtract(10))
    )
  ),
  new Rule(
    'city:shrink:check-valid',
    new Criterion((city) => city.size() === 0),
    new Effect((city) => city.destroy())
  ),
];

export default getRules;
