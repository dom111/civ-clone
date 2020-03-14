import PlayerTreasury from './PlayerTreasury.js';
import Registry from '../core-registry/Registry.js';

export class PlayerTreasuryRegistry extends Registry {
  constructor() {
    super(PlayerTreasury);
  }
}

export default PlayerTreasuryRegistry;
