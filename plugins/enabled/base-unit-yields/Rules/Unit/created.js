import Effect from '../../../core-rules/Effect.js';
import {Moves} from '../../../core-unit/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'unit:created:yields',
  new Effect((unit) => unit.moves = new Moves(unit.movement))
));

RulesRegistry.register(new Rule(
  'unit:created:register',
  new Effect((unit) =>   UnitRegistry.register(unit))
));

RulesRegistry.register(new Rule(
  'unit:created:event',
  new Effect((unit) => engine.emit('unit:created', unit))
));
