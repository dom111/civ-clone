import Effect from '../core-rules/Effect.js';
import PlayerActionRegistry from './PlayerActionRegistry.js';

// base actions
[
  (player) => player.units.filter((unit) => unit.active && unit.movesLeft),
  (player) => player.cities.filter((city) => ! city.building),
]
  .forEach((effect) => PlayerActionRegistry.register(new Effect(effect)))
;
