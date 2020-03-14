import RulesRegistry from '../core-rules/RulesRegistry.js';
import cityYield from './Rules/city/yield.js';

RulesRegistry.getInstance()
  .register(
    ...cityYield()
  )
;
