import {BoardTransport, Move} from './Actions.js';
import UnitActionRegistry from '../core-unit-actions/UnitActionRegistry.js';

[BoardTransport, Move]
  .forEach((Action) => UnitActionRegistry.register(Action))
;