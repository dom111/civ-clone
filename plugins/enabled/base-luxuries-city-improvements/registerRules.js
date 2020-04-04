import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityYield from './Rules/city/yield.js';

RulesRegistry.getInstance()
  .register(
    ...cityYield()
  )
;
