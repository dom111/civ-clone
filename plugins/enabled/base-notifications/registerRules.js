import RulesRegistry from '../core-rules/RulesRegistry.js';
import turnStart from './Rules/Turn/start.js';

RulesRegistry.getInstance()
  .register(
    ...turnStart()
  )
;
