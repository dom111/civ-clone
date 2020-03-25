import * as TerrainFeatures from './TerrainFeatures.js';
import AvailableTerrainFeatureRegistry from '../core-terrain-features/AvailableTerrainFeatureRegistry.js';

AvailableTerrainFeatureRegistry.getInstance()
  .register(...Object.values(TerrainFeatures))
;