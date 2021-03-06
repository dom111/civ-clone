import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import buildingComplete from './Rules/City/building-complete.js';
import captured from './Rules/City/captured.js';
import cost from './Rules/City/cost.js';
import created from './Rules/City/created.js';
import destroyed from './Rules/City/destroyed.js';
import engineStart from './Rules/Engine/start.js';
import grow from './Rules/City/grow.js';
import playerAction from './Rules/Player/action.js';
import processYield from './Rules/City/process-yield.js';
import shrink from './Rules/City/shrink.js';

RulesRegistry.getInstance()
  .register(
    ...buildingComplete(),
    ...captured(),
    ...cost(),
    ...created(),
    ...destroyed(),
    ...engineStart(),
    ...grow(),
    ...playerAction(),
    ...processYield(),
    ...shrink()
  )
;
