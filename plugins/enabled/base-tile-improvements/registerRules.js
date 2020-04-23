import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import engineStart from './Rules/Engine/start.js';
import improvement from './Rules/Tile/improvement.js';
import tileYield from './Rules/Tile/yield.js';

RulesRegistry.getInstance()
  .register(
    ...engineStart(),
    ...improvement(),
    ...tileYield()
  )
;
