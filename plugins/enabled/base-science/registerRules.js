import RulesRegistry from '../core-rules/RulesRegistry.js';
import added from './Rules/Player/added.js';
import cost from './Rules/Research/cost.js';
import processYield from './Rules/City/process-yield.js';
import requirements from './Rules/Research/requirements.js';
import research from './Rules/Player/research.js';
import researchComplete from './Rules/Player/research-complete.js';

RulesRegistry.getInstance()
  .register(
    ...processYield(),
    ...added(),
    ...cost(),
    ...requirements(),
    ...research(),
    ...researchComplete()
  )
;
