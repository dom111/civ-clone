import CityGrowth from './CityGrowth.js';
import Registry from '../core-registry/Registry.js';

export class CityGrowthRegistry extends Registry {
  constructor() {
    super(CityGrowth);
  }
}

export default CityGrowthRegistry;
