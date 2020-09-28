import * as Advances from './Advances.js';
import AdvanceRegistry from '../core-science/AdvanceRegistry.js';

AdvanceRegistry.getInstance()
  .register(...Object.values(Advances))
;
