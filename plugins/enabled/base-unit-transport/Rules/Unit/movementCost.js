import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Land} from '../../../base-unit/Types.js';
import {NavalTransport} from '../../Types.js';
import Rule from '../../../core-rules/Rule.js';
import TransportRegistry from '../../TransportRegistry.js';

export const getRules = ({
  transportRegistry = TransportRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:movementCost:beingTransported',
    new Criterion((unit) => unit instanceof Land),
    new Criterion((unit) => transportRegistry.getBy('unit', unit)
      .length > 0
    ),
    new Criterion((unit) => transportRegistry.getBy('unit', unit)
      .every((manifest) => manifest.transport() instanceof NavalTransport)
    ),
    new Effect(() => 0)
  ),
];

export default getRules;
