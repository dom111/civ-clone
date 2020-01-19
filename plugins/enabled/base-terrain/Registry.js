import Registry from '../core-registry/Registry.js';
import Terrain from './Terrain.js';

export const TerrainRegistry = new Registry('terrain', Terrain);

export default TerrainRegistry;