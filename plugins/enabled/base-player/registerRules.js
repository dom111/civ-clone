import RulesRegistry from '../core-rules/RulesRegistry.js';
import added from './Rules/Player/added.js';
import created from './Rules/Unit/created.js';
import start from './Rules/Turn/start.js';

RulesRegistry.getInstance()
  .register(
    ...added(),
    ...created(),
    ...start()
  )
;
