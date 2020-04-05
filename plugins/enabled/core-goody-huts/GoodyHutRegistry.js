import GoodyHut from './GoodyHut.js';
import Registry from '../core-registry/Registry.js';

export class GoodyHutRegistry extends Registry {
  constructor() {
    super(GoodyHut);
  }
}

export default GoodyHutRegistry;
