import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import created from './Rules/Unit/created.js';

RulesRegistry.getInstance()
  .register(
    ...created()
  )
;
