import Registry from '../core-registry/Registry.js';
import TerrainFeature from './TerrainFeature.js';

export class AvailableTerrainFeatureRegistry extends Registry {
  constructor() {
    super(TerrainFeature);
  }
}

export default AvailableTerrainFeatureRegistry;
