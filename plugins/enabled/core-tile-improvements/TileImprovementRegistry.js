import Registry from '../core-registry/Registry.js';
import TileImprovement from './TileImprovement.js';

export class TileImprovementRegistry extends Registry {
  constructor() {
    super(TileImprovement);
  }
}

export default TileImprovementRegistry;
