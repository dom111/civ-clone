import RulesRegistry from '../core-rules/RulesRegistry.js';
import tileYield from './Rules/Tile/yield.js';

RulesRegistry.getInstance()
  .register(
    ...tileYield()
  )
;
