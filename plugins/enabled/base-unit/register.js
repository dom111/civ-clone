import {Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme} from './Units.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';

[Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme]
  .forEach((Unit) => AvailableUnitRegistry.register(Unit))
;
