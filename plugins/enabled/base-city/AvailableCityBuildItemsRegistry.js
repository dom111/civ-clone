import CityImprovement from '../core-city-improvement/CityImprovement.js';
import Registry from '../core-registry/Registry.js';
import Unit from '../core-unit/Unit.js';

export class AvailableCityBuildItemsRegistry extends Registry {
  constructor() {
    super(Unit, CityImprovement);
  }
}

export default AvailableCityBuildItemsRegistry;
