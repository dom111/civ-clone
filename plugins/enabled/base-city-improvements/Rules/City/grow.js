import {Aqueduct, Granary} from '../../CityImprovements.js';
import CityGrowthRegistry from '../../../base-city/CityGrowthRegistry.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:grow:aqueduct',
  new Criterion((city) => ! CityImprovementRegistry.getBy('city', city)
    .some((improvement) => improvement instanceof Aqueduct)
  ),
  new Criterion((city) => city.size > 10),
  new Effect((city) => city.shrink())
));

RulesRegistry.register(new Rule(
  'city:grow:granary',
  new Criterion((city) => CityImprovementRegistry.getBy('city', city)
    .some((improvement) => improvement instanceof Granary)
  ),
  new Effect((city) => CityGrowthRegistry.getBy('city', city)
    .forEach((cityGrowth) => cityGrowth.add(new Food(cityGrowth.cost.value() / 2)))
  )
));
