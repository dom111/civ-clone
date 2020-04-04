import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost()
  )
;
