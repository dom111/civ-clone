import RulesRegistry from '../core-rules/RulesRegistry.js';
import improvement from './Rules/Tile/improvement.js';
import tileYield from './Rules/Tile/yield.js';

RulesRegistry.getInstance()
  .register(
    ...improvement(),
    ...tileYield()
  )
;
