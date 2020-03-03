import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Move} from '../../Actions.js';
import {NavalTransport} from '../../../base-unit/Types.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trireme} from '../../../base-unit/Units.js';

RulesRegistry.register(new Rule(
  'unit:moved:event',
  new Effect((unit, action) => engine.emit('unit:moved', unit, action))
));

RulesRegistry.register(new Rule(
  'unit:moved:transport-cargo',
  new Criterion((unit) => unit instanceof NavalTransport),
  new Criterion((unit, action) => action instanceof Move),
  new Criterion((unit) => unit.hasCargo()),
  new Effect((unit, action) => unit.cargo.forEach((unit) => unit.action(action.forUnit(unit))))
));

RulesRegistry.register(new Rule(
  'unit:moved:trireme',
  new Criterion((unit) => unit instanceof Trireme),
  new Criterion((unit) => unit.moves.value() === 0),
  new Criterion((unit) => ! unit.tile.isCoast()),
  new Criterion(() => Math.random() <= .5),
  new Effect((unit) => {
    unit.destroy();
    engine.emit('trireme:lost-at-sea', unit);
  })
));

RulesRegistry.register(new Rule(
  'unit:moved:apply-visibility',
  new Effect((unit) => unit.applyVisibility())
));

RulesRegistry.register(new Rule(
  'unit:moved:deactivate',
  new Criterion((unit) => unit.moves.value() < .1),
  new Effect((unit) => {
    unit.active = false;
  })
));
