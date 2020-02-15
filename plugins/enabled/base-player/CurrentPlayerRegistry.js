import {Player} from '../core-player/Player.js';
import {Registry} from '../core-registry/Registry.js';

export const CurrentPlayerRegistry = new Registry(Player);

export default CurrentPlayerRegistry;
