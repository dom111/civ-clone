import PlayerGovernment from './PlayerGovernment.js';
import Registry from '../core-registry/Registry.js';

export const PlayerGovernmentRegistry = new Registry('player-government', PlayerGovernment);

export default PlayerGovernmentRegistry;
