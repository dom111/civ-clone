import Registry from '../core-registry/Registry.js';
import Unit from './Unit.js';

export const UnitRegistry = new Registry('unit', Unit);

export default UnitRegistry;