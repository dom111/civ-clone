import PlayerRegistry from '../../PlayerRegistry.js';

engine.on('player:defeated', (player) => {
  PlayerRegistry.unregister(player);
});
