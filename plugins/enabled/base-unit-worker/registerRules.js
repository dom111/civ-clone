import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import unitAction from './Rules/Unit/action.js';

RulesRegistry.getInstance()
  .register(
    ...unitAction()
  )
;
