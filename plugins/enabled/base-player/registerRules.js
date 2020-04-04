import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import added from './Rules/Player/added.js';
import created from './Rules/Unit/created.js';
import start from './Rules/Turn/start.js';
// import turnStart from './Rules/Player/turn-start.js';
// import turnEnd from './Rules/Player/turn-end.js';

RulesRegistry.getInstance()
  .register(
    ...added(),
    ...created(),
    ...start()

    // these are problematic so we need to stick to events for now
    // ...turnEnd(),
    // ...turnStart()
  )
;
