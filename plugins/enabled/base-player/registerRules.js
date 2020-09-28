import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import playerAdded from './Rules/Player/added.js';
import turnStart from './Rules/Turn/start.js';
import unitCreated from './Rules/Unit/created.js';
import worldBuilt from './Rules/World/built.js';
// import turnStart from './Rules/Player/turn-start.js';
// import turnEnd from './Rules/Player/turn-end.js';

RulesRegistry.getInstance()
  .register(
    ...playerAdded(),
    ...unitCreated(),
    ...turnStart(),
    ...worldBuilt()

    // these are problematic so we need to stick to events for now
    // ...turnEnd(),
    // ...turnStart()
  )
;
