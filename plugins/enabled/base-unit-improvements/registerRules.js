import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import activate from './Rules/Unit/activate.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...activate(),
    ...unitYield()
  )
;
