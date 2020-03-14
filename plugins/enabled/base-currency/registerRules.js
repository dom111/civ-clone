import RulesRegistry from '../core-rules/RulesRegistry.js';
import added from './Rules/Player/added.js';
import processYields from './Rules/City/process-yield.js';
import spend from './Rules/City/spend.js';
import treasuryUpdated from './Rules/Player/treasury-updated.js';

RulesRegistry.getInstance()
  .register(
    ...processYields(),
    ...spend(),
    ...added(),
    ...treasuryUpdated()
  )
;
