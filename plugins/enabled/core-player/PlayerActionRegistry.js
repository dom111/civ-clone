import PlayerActionProvider from './PlayerActionProvider.js';
import Registry from '../core-registry/Registry.js';

export class PlayerActionRegistry extends Registry {
  constructor() {
    super(PlayerActionProvider);
  }
}

export default PlayerActionRegistry;
