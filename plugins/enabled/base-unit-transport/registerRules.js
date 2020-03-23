import RulesRegistry from '../core-rules/RulesRegistry.js';
import action from './Rules/Unit/action.js';
import buildCost from './Rules/City/build-cost.js';
import moved from './Rules/Unit/moved.js';
import movementCost from './Rules/Unit/movementCost.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...action(),
    ...buildCost(),
    ...moved(),
    ...movementCost(),
    ...unitYield()
  )
;
