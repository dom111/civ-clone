import {
  Sail,
  Trireme,
} from './Units.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';

[
  Sail,
  Trireme,
]
  .forEach((Unit) => AvailableUnitRegistry.getInstance()
    .register(Unit)
  )
;
