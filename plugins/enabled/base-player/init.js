import AIPlayer from 'core-player/AIPlayer.js';
import Civilization from 'core-civilization/Civilization.js';
import Unit from 'core-unit/Unit.js';

// TODO: stop defining things on engine
Object.defineProperty(engine, 'isTurnEnd', {
  value: () => (! this.currentPlayer) || (this.currentPlayer.actionsLeft === 0)
});

engine.on('turn-over', () => {
  if (engine.isTurnEnd()) {
    engine.emit('turn-end');
  }
  else {
    // TODO: use notifications
    console.log(`No auto end-turn because there are actions left: ${engine.currentPlayer.actionsLeft}`);
  }
});

engine.on('build', () => {
  engine.players = [];

  // engine.addPlayers(); // TODO
  const startingSquares = engine.map.getBy((tile) => tile.food >= 2);

  startingSquares.sort(() => Math.floor(3 * Math.random()) - 1);

  for (let i = 0; i < engine.options.players; i++) {
    const player = new AIPlayer();

    // TODO: use Civilization.available or something
    player.chooseCivilization(Civilization.civilizations);

    const startSquare = startingSquares.shift();

    engine.players.push(player);

    new Unit({
      unit: 'settlers',
      tile: startSquare,
      player: player
    });
  }
});

engine.on('turn-start', () => {
  engine.playersToAction = engine.players.slice(0);
  engine.currentPlayer = engine.playersToAction.shift();

  engine.emit('player-turn-start', engine.currentPlayer);
});

engine.on('player-turn-end', () => {
  if (engine.isTurnEnd()) {
    if (engine.playersToAction.length) {
      engine.currentPlayer = engine.playersToAction.shift();
      engine.emit('player-turn-start', engine.currentPlayer);
    }
    else {
      engine.emit('turn-end');
    }
  }
  else {
    // TODO: use notifications
    console.log('Not turn end.');
  }
});

engine.on('player-visibility-changed', (player) => {
  // clear the visibility
  player.visibleTiles.splice(0, player.visibleTiles.length);
  engine.emit('build-layer', 'visibility');
  engine.emit('build-layer', 'activeVisibility');
});
