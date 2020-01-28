import Civilization from './Civilization.js';
import Registry from '../core-registry/Registry.js';

export const CivilizationRegistry = new Registry('civilization', Civilization);

export default CivilizationRegistry;
