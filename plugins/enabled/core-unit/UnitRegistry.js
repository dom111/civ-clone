import Registry from '../core-registry/Registry.js';
import Unit from './Unit.js';

export class UnitRegistry extends Registry {
  constructor() {
    super(Unit);
  }
}

export default UnitRegistry;
