import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import turnYear from './Rules/Turn/year.js';

RulesRegistry.getInstance()
  .register(
    ...turnYear()
  )
;
