import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import cityYield from './Rules/City/yield.js';

RulesRegistry.getInstance()
  .register(
    ...cityYield()
  )
;
