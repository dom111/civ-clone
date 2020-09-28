import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import build from './Rules/City/build.js';

RulesRegistry.getInstance()
  .register(
    ...build()
  )
;
