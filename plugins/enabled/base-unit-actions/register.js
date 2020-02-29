import {Embark, Move} from './Actions.js';
import UnitActionRegistry from '../core-unit-actions/UnitActionRegistry.js';

[Embark, Move]
  .forEach((Action) => UnitActionRegistry.register(Action))
;