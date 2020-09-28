import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import buildCost from './Rules/City/build-cost.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...buildCost(),
    ...unitYield()
  )
;
