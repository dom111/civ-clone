import Effect from '../core-rules/Effect.js';
import PlayerActionRegistry from './PlayerActionRegistry.js';

// base actions
PlayerActionRegistry.register(new Effect((player) => player.units.filter((unit) => unit.active && unit.movesLeft)));
PlayerActionRegistry.register(new Effect((player) => player.cities.filter((city) => ! city.building)));
