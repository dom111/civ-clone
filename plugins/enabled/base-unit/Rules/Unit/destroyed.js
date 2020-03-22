import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:destroyed:event',
    new Effect((unit, player) => engine.emit('unit:destroyed', unit, player))
  ),

  new Rule(
    'unit:destroyed:unregister',
    new Effect((unit) => unitRegistry.unregister(unit))
  ),

  new Rule(
    'unit:destroyed:flags',
    new Effect((unit) => {
      unit.setActive(false);
      unit.setDestroyed();
    })
  ),
];

export default getRules;
