import RulesRegistry from '../core-rules/RulesRegistry.js';
import created from './Rules/Unit/created.js';
import unitYield from './Rules/Unit/yield.js';

RulesRegistry.getInstance()
  .register(
    ...created(),
    ...unitYield()
  )
;
