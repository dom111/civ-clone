import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import distribution from './Rules/Terrain/distribution.js';
import distributionGroups from './Rules/Terrain/distributionGroups.js';

RulesRegistry.getInstance()
  .register(
    ...distribution(),
    ...distributionGroups()
  )
;
