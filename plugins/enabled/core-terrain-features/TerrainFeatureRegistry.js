import Registry from '../core-registry/Registry.js';
import TerrainFeature from './TerrainFeature.js';

export const TerrainFeatureRegistry = new Registry('terrain-feature', TerrainFeature);

export default TerrainFeatureRegistry;