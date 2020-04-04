import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import created from './Rules/Terrain/created.js';
import feature from './Rules/Terrain/feature.js';
import tileYield from './Rules/Tile/yield.js';

RulesRegistry.getInstance()
  .register(
    ...tileYield(),
    ...created(),
    ...feature()
  )
;
