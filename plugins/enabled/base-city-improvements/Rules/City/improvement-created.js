import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'city:improvement:created:register',
    new Effect((cityImprovement) => cityImprovementRegistry.register(cityImprovement))
  ),

  new Rule(
    'city:improvement:created:event',
    new Effect((cityImprovement, city) => engine.emit('city-improvement:created', cityImprovement, city))
  ),
];

export default getRules;
