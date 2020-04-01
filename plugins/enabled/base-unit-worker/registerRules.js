import RulesRegistry from '../core-rules/RulesRegistry.js';
import unitAction from './Rules/Unit/action.js';

RulesRegistry.getInstance()
  .register(
    ...unitAction()
  )
;
