import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import cityCreated from './Rules/City/created.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...cityCreated()
  )
;
