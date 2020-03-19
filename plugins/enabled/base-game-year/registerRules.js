import RulesRegistry from '../core-rules/RulesRegistry.js';
import turnYear from './Rules/Turn/year.js';

RulesRegistry.getInstance()
  .register(
    ...turnYear()
  )
;
