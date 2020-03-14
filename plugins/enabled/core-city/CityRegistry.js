import City from './City.js';
import Registry from '../core-registry/Registry.js';

export class CityRegistry extends Registry {
  constructor() {
    super(City);
  }
}

export default CityRegistry;
