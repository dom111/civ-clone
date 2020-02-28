import PlayerActionProvider from './PlayerActionProvider.js';
import PlayerActionRegistry from './PlayerActionRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

// base actions
PlayerActionRegistry.register(new PlayerActionProvider((player) => UnitRegistry.getBy('player', player)
  .filter((unit) => unit.active && unit.movesLeft)
));
