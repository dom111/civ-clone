import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...unitYield()
  )
;
