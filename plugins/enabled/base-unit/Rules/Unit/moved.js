import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Move} from '../../Actions.js';
import {NavalTransport} from '../../Types.js';
import Rule from '../../../core-rules/Rule.js';
import {Trireme} from '../../Units.js';

export const getRules = () => [
  new Rule(
    'unit:moved:event',
    new Effect((unit, action) => engine.emit('unit:moved', unit, action))
  ),

  new Rule(
    'unit:moved:transport-cargo',
    new Criterion((unit) => unit instanceof NavalTransport),
    new Criterion((unit, action) => action instanceof Move),
    new Criterion((unit) => unit.hasCargo()),
    new Effect((unit, action) => unit.cargo.forEach((unit) => unit.action(action.forUnit(unit))))
  ),

  new Rule(
    'unit:moved:trireme',
    new Criterion((unit) => unit instanceof Trireme),
    new Criterion((unit) => unit.moves.value() === 0),
    new Criterion((unit) => ! unit.tile.isCoast()),
    new Criterion(() => Math.random() <= .5),
    new Effect((unit) => {
      unit.destroy();
      engine.emit('trireme:lost-at-sea', unit);
    })
  ),

  new Rule(
    'unit:moved:apply-visibility',
    new Effect((unit) => unit.applyVisibility())
  ),

  new Rule(
    'unit:moved:deactivate',
    new Criterion((unit) => unit.moves.value() < .1),
    new Effect((unit) => {
      unit.active = false;
    })
  ),
];

export default getRules;
