import Generator from './Generator.js';
import Registry from '../core-registry/Registry.js';

export const WorldGeneratorRegistry = new Registry(Generator);

export default WorldGeneratorRegistry;
