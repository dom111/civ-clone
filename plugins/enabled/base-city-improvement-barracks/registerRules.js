import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import unitCreated from './Rules/Unit/created.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...unitCreated()
  )
;
