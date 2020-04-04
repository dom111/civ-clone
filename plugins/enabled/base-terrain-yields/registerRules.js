import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import tileYield from './Rules/Tile/yield.js';

RulesRegistry.getInstance()
  .register(
    ...tileYield()
  )
;
