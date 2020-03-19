import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';
import unitsToMove from './PlayerActions/unitsToMove.js';

PlayerActionRegistry.getInstance()
  .register(
    ...unitsToMove()
  )
;
