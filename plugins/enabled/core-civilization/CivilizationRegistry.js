import Civilization from './Civilization.js';
import Registry from '../core-registry/Registry.js';

export class CivilizationRegistry extends Registry {
  constructor() {
    super(Civilization);
  }
}

export default CivilizationRegistry;
