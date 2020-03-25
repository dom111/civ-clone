import Registry from '../core-registry/Registry.js';
import Wonder from './Wonder.js';

export class WonderRegistry extends Registry {
  constructor() {
    super(Wonder);
  }
}

export default WonderRegistry;
