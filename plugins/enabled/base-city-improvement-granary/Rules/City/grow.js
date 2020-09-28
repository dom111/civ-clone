import CityGrowthRegistry from '../../../base-city/CityGrowthRegistry.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-terrain-yields/Yields.js';
import {Granary} from '../../Granary.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:grow:granary',
    new Criterion((city) => cityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof Granary)
    ),
    new Effect((city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => cityGrowth.add(new Food(cityGrowth.cost().value() / 2)))
    )
  ),
];

export default getRules;
