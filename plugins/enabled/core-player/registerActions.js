import CityRegistry from '../core-city/CityRegistry.js';
import PlayerActionProvider from './PlayerActionProvider.js';
import PlayerActionRegistry from './PlayerActionRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

// base actions
[
  (player) => UnitRegistry.getBy('player', player)
    .filter((unit) => unit.active && unit.movesLeft)
  ,
  (player) => CityRegistry.getBy('player', player)
    .filter((city) => ! city.building)
  ,
]
  .forEach((provider) => PlayerActionRegistry.register(new PlayerActionProvider(provider)))
;
