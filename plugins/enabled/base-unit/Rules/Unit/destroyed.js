import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'unit:destroyed:event',
  new Effect((unit, player) => engine.emit('unit:destroyed', this, player))
));
