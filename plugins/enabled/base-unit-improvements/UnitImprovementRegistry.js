import Registry from '../core-registry/Registry.js';
import UnitImprovement from './UnitImprovement.js';

export class UnitImprovementRegistry extends Registry {
  constructor() {
    super(UnitImprovement);
  }
}

export default UnitImprovementRegistry;
