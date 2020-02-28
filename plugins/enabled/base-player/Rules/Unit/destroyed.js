import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'unit:destroyed:unregister',
  new Effect((unit) => UnitRegistry.unregister(unit))
));

RulesRegistry.register(new Rule(
  'unit:destroyed:flags',
  new Effect((unit) => {
    unit.active = false;
    unit.destroyed = true;
  })
));
