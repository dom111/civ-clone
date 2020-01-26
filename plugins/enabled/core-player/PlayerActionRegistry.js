import Effect from '../core-rules/Effect.js';
import Registry from '../core-registry/Registry.js';

export const PlayerActionRegistry = new Registry('player-action', Effect);

export default PlayerActionRegistry;
