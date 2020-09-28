import Criterion from '../../../core-rules/Criterion.js';
import {Disembark} from '../../Actions.js';
import Effect from '../../../core-rules/Effect.js';
import {Move} from '../../../base-unit/Actions.js';
import {NavalTransport} from '../../Types.js';
import Rule from '../../../core-rules/Rule.js';
import TransportRegistry from '../../TransportRegistry.js';
import {Trireme} from '../../Units.js';

export const getRules = ({
  transportRegistry = TransportRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:moved:transport-cargo',
    new Criterion((unit) => unit instanceof NavalTransport),
    new Criterion((unit, action) => action instanceof Move),
    new Criterion((unit) => unit.hasCargo()),
    new Effect((unit, action) => unit.cargo()
      .forEach((unit) => unit.action({
        action: action.forUnit(unit),
      }))
    )
  ),

  new Rule(
    'unit:moved:disembarked',
    new Criterion((unit, action) => action instanceof Disembark),
    new Effect((unit) => transportRegistry.getBy('unit', unit)
      .forEach((manifest) => {
        manifest.transport()
          .unload(unit)
        ;

        transportRegistry.unregister(manifest);
      })
    )
  ),

  new Rule(
    'unit:moved:trireme',
    new Criterion((unit) => unit instanceof Trireme),
    new Criterion((unit) => unit.moves().value() === 0),
    new Criterion((unit) => ! unit.tile().isCoast()),
    new Criterion(() => Math.random() <= .5),
    new Effect((unit) => {
      unit.destroy();
      engine.emit('trireme:lost-at-sea', unit);
    })
  ),
];

export default getRules;
