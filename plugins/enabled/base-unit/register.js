import {Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme} from './Units.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

[Catapult, Cavalry, Militia, Settlers, Spearman, Swordman, Trireme]
  .forEach((Unit) => UnitRegistry.register(Unit))
;
