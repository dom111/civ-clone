import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:building-complete:event',
  new Effect((city, built) => engine.emit('city:building-complete', city, built))
));
