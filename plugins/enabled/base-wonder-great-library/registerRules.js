import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import playerResearchComplete from './Rules/Player/research-complete.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...playerResearchComplete()
  )
;
