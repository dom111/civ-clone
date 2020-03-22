import PlayerActionProvider from '../../core-player/PlayerActionProvider.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export const getPlayerActions = ({
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => [
  new PlayerActionProvider((player) => unitRegistry.getBy('player', player)
    .filter((unit) => unit.active() && unit.moves().value())
    .sort((a, b) => a.waiting() - b.waiting())
  ),
];

export default getPlayerActions;
