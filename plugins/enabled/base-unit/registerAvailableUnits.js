import {
  Catapult,
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Settlers,
  Spearman,
  Swordman,
} from './Units.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';

[
  Catapult,
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Settlers,
  Spearman,
  Swordman,
]
  .forEach((Unit) => AvailableUnitRegistry.getInstance()
    .register(Unit)
  )
;
