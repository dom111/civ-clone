import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import turnStart from './Rules/Turn/start.js';

RulesRegistry.getInstance()
  .register(
    ...turnStart()
  )
;
