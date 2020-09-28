import CurrentPlayerRegistry from '../../../core-player/CurrentPlayerRegistry.js';

engine.on('player:turn-end', (player) => {
  const currentPlayerRegistry = CurrentPlayerRegistry.getInstance();

  currentPlayerRegistry.unregister(player);

  const [nextPlayer] = currentPlayerRegistry.entries();

  if (nextPlayer) {
    engine.emit('player:turn-start', nextPlayer);
  }
  else {
    engine.emit('turn:end');
  }
});
