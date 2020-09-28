import Aqueduct from '../../Aqueduct.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:grow:aqueduct',
    new Criterion((city) => ! cityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof Aqueduct)
    ),
    new Criterion((city) => city.size() > 10),
    new Effect((city) => city.shrink())
  ),
];

export default getRules;
