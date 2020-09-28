import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  unitRegistry = UnitRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'unit:created:register',
    new Effect((unit) => unitRegistry.register(unit))
  ),

  new Rule(
    'unit:created:event',
    new Effect((unit) => engine.emit('unit:created', unit))
  ),
];

export default getRules;
