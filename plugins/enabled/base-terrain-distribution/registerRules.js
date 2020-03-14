import RulesRegistry from '../core-rules/RulesRegistry.js';
import distribution from './Rules/Terrain/distribution.js';
import distributionGroups from './Rules/Terrain/distributionGroups.js';

RulesRegistry.getInstance()
  .register(
    ...distribution(),
    ...distributionGroups()
  )
;
