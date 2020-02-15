import CurrentPlayerRegistry from '../../CurrentPlayerRegistry.js';
import PlayerRegistry from '../../PlayerRegistry.js';

engine.on('turn:start', () => {
  PlayerRegistry.entries()
    .forEach((player) => CurrentPlayerRegistry.register(player))
  ;

  const [currentPlayer] = CurrentPlayerRegistry.entries();

  engine.emit('player:turn-start', currentPlayer);
});
