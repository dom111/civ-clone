import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import cityCost from './Rules/City/cost.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...cityCost()
  )
;
