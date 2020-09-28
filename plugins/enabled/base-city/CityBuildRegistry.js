import CityBuild from './CityBuild.js';
import Registry from '../core-registry/Registry.js';

export class CityBuildRegistry extends Registry {
  constructor() {
    super(CityBuild);
  }
}

export default CityBuildRegistry;
