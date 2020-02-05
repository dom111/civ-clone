import PlayerActionProvider from './PlayerActionProvider.js';
import Registry from '../core-registry/Registry.js';

export const PlayerActionRegistry = new Registry(PlayerActionProvider);

export default PlayerActionRegistry;
