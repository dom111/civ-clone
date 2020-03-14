import RulesRegistry from '../core-rules/RulesRegistry.js';
import build from './Rules/City/created.js';
import buildCost from './Rules/City/build-cost.js';
import cost from './Rules/City/cost.js';
import created from './Rules/City/created.js';
import grow from './Rules/City/grow.js';
import improvementCreated from './Rules/City/improvement-created.js';

RulesRegistry.getInstance()
  .register(
    ...build(),
    ...buildCost(),
    ...cost(),
    ...created(),
    ...grow(),
    ...improvementCreated()
  )
;