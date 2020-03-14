import RulesRegistry from '../core-rules/RulesRegistry.js';
import added from './Rules/Player/added.js';
import cost from './Rules/City/cost.js';

RulesRegistry.getInstance()
  .register(
    ...cost(),
    ...added()
  )
;
