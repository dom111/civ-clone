import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import build from './Rules/City/build.js';
import buildingComplete from './Rules/City/building-complete.js';

RulesRegistry.getInstance()
  .register(
    ...build(),
    ...buildingComplete()
  )
;
