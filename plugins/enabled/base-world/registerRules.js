import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import engineStart from './Rules/Engine/start.js';
import tileSeen from './Rules/Tile/seen.js';

RulesRegistry.getInstance()
  .register(
    ...engineStart(),
    ...tileSeen()
  )
;
