import PlayerRegistry from '../../../core-player/PlayerRegistry.js';

engine.on('player:defeated', (player) => {
  PlayerRegistry.getInstance()
    .unregister(player)
  ;
});
