import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import added from './Rules/Player/added.js';
import cost from './Rules/City/cost.js';

RulesRegistry.getInstance()
  .register(
    ...cost(),
    ...added()
  )
;
