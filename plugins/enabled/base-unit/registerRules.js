import RulesRegistry from '../core-rules/RulesRegistry.js';
import action from './Rules/Unit/action.js';
import build from './Rules/City/build.js';
import created from './Rules/Unit/created.js';
import destroyed from './Rules/Unit/destroyed.js';
import moved from './Rules/Unit/moved.js';
import movementCost from './Rules/Unit/movementCost.js';
import validateMove from './Rules/Unit/validateMove.js';

RulesRegistry.getInstance()
  .register(
    ...action(),
    ...build(),
    ...created(),
    ...destroyed(),
    ...moved(),
    ...movementCost(),
    ...validateMove()
  )
;
