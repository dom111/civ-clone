import Registry from '../core-registry/Registry.js';
import Terrain from './Terrain.js';

export class TerrainRegistry extends Registry {
  constructor() {
    super(Terrain);
  }
}

export default TerrainRegistry;