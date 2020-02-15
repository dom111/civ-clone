import CurrentPlayerRegistry from '../../CurrentPlayerRegistry.js';

engine.on('player:turn-end', (player) => {
  CurrentPlayerRegistry.unregister(player);

  const [nextPlayer] = CurrentPlayerRegistry.entries();

  if (nextPlayer) {
    engine.emit('player:turn-start', nextPlayer);
  }
  else {
    engine.emit('turn:end');
  }
});
