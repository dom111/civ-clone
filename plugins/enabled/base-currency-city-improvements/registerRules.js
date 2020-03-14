import RulesRegistry from '../core-rules/RulesRegistry.js';
import cityYield from './Rules/City/yield.js';

RulesRegistry.getInstance()
  .register(
    ...cityYield()
  )
;
