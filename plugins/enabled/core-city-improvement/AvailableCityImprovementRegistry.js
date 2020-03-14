import CityImprovement from './CityImprovement.js';
import Registry from '../core-registry/Registry.js';

export class AvailableCityImprovementRegistry extends Registry {
  constructor() {
    super(CityImprovement);
  }
}

export default AvailableCityImprovementRegistry;
