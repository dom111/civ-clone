import RulesRegistry from '../core-rules/RulesRegistry.js';
import seen from './Rules/Tile/seen.js';

RulesRegistry.getInstance()
  .register(
    ...seen()
  )
;
