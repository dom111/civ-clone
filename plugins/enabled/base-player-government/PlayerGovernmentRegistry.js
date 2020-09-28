import PlayerGovernment from './PlayerGovernment.js';
import Registry from '../core-registry/Registry.js';

export class PlayerGovernmentRegistry extends Registry {
  constructor() {
    super(PlayerGovernment);
  }
}

export default PlayerGovernmentRegistry;
