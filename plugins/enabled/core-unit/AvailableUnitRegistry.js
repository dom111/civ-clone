import Registry from '../core-registry/Registry.js';
import Unit from './Unit.js';

export class AvailableUnitRegistry extends Registry {
  constructor() {
    super(Unit);
  }
}

export default AvailableUnitRegistry;