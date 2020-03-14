import RulesRegistry from '../core-rules/RulesRegistry.js';
import added from './Rules/Player/added.js';
import cityYield from './Rules/City/yield.js';

RulesRegistry.getInstance()
  .register(
    ...added(),
    ...cityYield()
  )
;
