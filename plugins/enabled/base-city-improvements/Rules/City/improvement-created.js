import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:improvement:created:register',
  new Effect((cityImprovement) => CityImprovementRegistry.register(cityImprovement))
));

RulesRegistry.register(new Rule(
  'city:improvement:created:event',
  new Effect((cityImprovement, city) => engine.emit('city-improvement:created', cityImprovement, city))
));
