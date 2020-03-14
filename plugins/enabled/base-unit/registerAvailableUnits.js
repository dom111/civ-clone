import {
  Catapult,
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Sail,
  Settlers,
  Spearman,
  Swordman,
  Trireme,
} from './Units.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';

[
  Catapult,
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Sail,
  Settlers,
  Spearman,
  Swordman,
  Trireme,
]
  .forEach((Unit) => AvailableUnitRegistry.getInstance()
    .register(Unit)
  )
;
