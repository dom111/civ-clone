import PlayerActionProvider from '../core-player/PlayerActionProvider.js';
import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

// base actions
PlayerActionRegistry.getInstance()
  .register(new PlayerActionProvider((player) => UnitRegistry.getInstance()
    .getBy('player', player)
    .filter((unit) => unit.active && unit.moves.value())
  ))
;
