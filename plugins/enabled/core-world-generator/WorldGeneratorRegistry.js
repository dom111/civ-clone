import Generator from './Generator.js';
import Registry from '../core-registry/Registry.js';

export class WorldGeneratorRegistry extends Registry {
  constructor() {
    super(Generator);
  }
}

export default WorldGeneratorRegistry;
