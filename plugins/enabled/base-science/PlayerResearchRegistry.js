import PlayerResearch from './PlayerResearch.js';
import Registry from '../core-registry/Registry.js';

export class PlayerResearchRegistry extends Registry {
  constructor() {
    super(PlayerResearch);
  }
}

export default PlayerResearchRegistry;
