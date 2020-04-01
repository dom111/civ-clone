import RulesRegistry from '../core-rules/RulesRegistry.js';
import build from './Rules/City/build.js';
import buildCost from './Rules/City/build-cost.js';
import buildingComplete from './Rules/City/building-complete.js';
import unitAction from './Rules/Unit/action.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...build(),
    ...buildCost(),
    ...buildingComplete(),
    ...unitAction(),
    ...unitYield()
  )
;
