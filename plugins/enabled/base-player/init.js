import AIPlayer from 'core-player/AIPlayer.js';
import Civilization from 'core-civilization/Civilization.js';
import Unit from 'core-unit/Unit.js';

// TODO: stop defining things on engine
Object.defineProperty(engine, 'isTurnEnd', {
  value() {
    return (! this.currentPlayer) || (this.currentPlayer.actionsLeft === 0);
  }
});

engine.on('turn:over', () => {
  if (engine.isTurnEnd()) {
    engine.emit('turn:end');
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

  let availableCivilizations = Civilization.civilizations;

  startingSquares.sort(() => Math.floor(3 * Math.random()) - 1);

  for (let i = 0; i < engine.options.players; i++) {
    const player = new AIPlayer();

    // TODO: use Civilization.available or something
    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((civilization) => ! (player.civilization instanceof civilization));

    const startSquare = startingSquares.shift();

    engine.players.push(player);

    Unit.fromDefinition({
      unit: 'Settlers',
      tile: startSquare,
      player: player
    });
  }
});

engine.on('turn:start', () => {
  engine.playersToAction = engine.players.slice(0);
  engine.currentPlayer = engine.playersToAction.shift();

  engine.emit('player:turn-start', engine.currentPlayer);
});

engine.on('player:turn-start', async (player) => {
  console.log(`${player}'s turn.`);

  await player.takeTurn();

  engine.emit('player:turn-end');
});

engine.on('player:turn-end', () => {
  // if (engine.isTurnEnd()) {
  if (engine.playersToAction.length) {
    engine.currentPlayer = engine.playersToAction.shift();
    engine.emit('player:turn-start', engine.currentPlayer);
  }
  else {
    engine.emit('turn:end');
  }
  // }
  // else {
  //   // TODO: use notifications
  //   console.log('Not turn end.');
  // }
});

engine.on('player:visibility-changed', (player) => {
  // clear the visibility
  player.visibleTiles.splice(0, player.visibleTiles.length);
  engine.emit('build-layer', 'visibility');
  engine.emit('build-layer', 'activeVisibility');
});

// unit related
engine.on('turn:start', () => {
  engine.players.forEach((player) => {
    player.units.forEach((unit) => {
      if (unit.busy > 0) {
        unit.busy--;
      }

      if (unit.busy === 0) {
        unit.busy = false;
        unit.active = true;
      }
    });
  });
});

engine.on('player:turn-start', (player) => {
  player.units.forEach((unit) => {
    if (unit.busy) {
      if (unit.busy < 0) {
        // sentry/fortify
      }
      else {
        unit.busy--;

        if (unit.busy <= 0) {
          unit.currentAction.complete(unit);
        }
        else {
          unit.movesLeft = 0;
        }
      }
    }

    if (! unit.busy) {
      unit.movesLeft = unit.movement;
      unit.active = true;
    }
  });

  engine.emit('unit:activate-next', player);
});

engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  unit.tile.units.push(unit);
});

engine.on('unit:activate', (unit) => {
  unit.player.activeUnit = unit;
  unit.active = true;
});

engine.on('unit:moved', (unit, from) => {
  unit.applyVisibility();

  from.units = from.units.filter((tileUnit) => tileUnit !== unit);

  if ((unit.movesLeft <= 0.1) && (engine.currentPlayer.activeUnit === unit)) {
    unit.player.activeUnit = false;
    unit.active = false;

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:action', (unit) => {
  if ((unit.movesLeft <= 0.1) && (engine.currentPlayer.activeUnit === unit)) {
    unit.player.activeUnit = false;
    unit.active = false;

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:destroyed', (unit) => {
  unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);
  unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);
  unit.active = false;
  unit.destroyed = true;

  if (engine.currentPlayer === unit.player) {
    if (unit.player.activeUnit === unit) {
      unit.player.activeUnit = false;
    }

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:activate-next', () => {
  if (engine.currentPlayer.unitsToAction.length) {
    engine.emit('unit:activate', engine.currentPlayer.unitsToAction[0]);
  }
  else {
    engine.emit('player:turn-end');
  }
});
