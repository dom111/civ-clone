import {Player} from './Player.js';
import {Registry} from '../core-registry/Registry.js';

export class PlayerRegistry extends Registry {
  constructor() {
    super(Player);
  }
}

export default PlayerRegistry;
