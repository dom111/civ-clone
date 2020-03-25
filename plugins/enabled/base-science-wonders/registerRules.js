import RulesRegistry from '../core-rules/RulesRegistry.js';
import build from './Rules/City/build.js';

RulesRegistry.getInstance()
  .register(
    ...build()
  )
;
