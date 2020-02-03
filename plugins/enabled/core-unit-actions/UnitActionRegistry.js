import Action from './Action.js';
import {Registry} from '../core-registry/Registry.js';

export const UnitActionRegistry = new Registry('unit:action', Action);

export default UnitActionRegistry;
