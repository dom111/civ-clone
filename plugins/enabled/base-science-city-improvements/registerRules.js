import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import build from './Rules/City/build.js';
import cityYield from './Rules/City/yield.js';

RulesRegistry.getInstance()
  .register(
    ...build(),
    ...cityYield()
  )
;
