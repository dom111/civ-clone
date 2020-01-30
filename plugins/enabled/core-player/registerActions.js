import PlayerActionProvider from './PlayerActionProvider.js';
import PlayerActionRegistry from './PlayerActionRegistry.js';

// base actions
[
  (player) => player.units.filter((unit) => unit.active && unit.movesLeft),
  (player) => player.cities.filter((city) => ! city.building),
]
  .forEach((provider) => PlayerActionRegistry.register(new PlayerActionProvider(provider)))
;
